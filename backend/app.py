"""Main entry point into server"""

import datetime
from functools import wraps
from os import environ
from flask import Flask, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from sqlalchemy import exc
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import jwt
from db.model import User, Chatroom

load_dotenv()
app = Flask(__name__)
app.config['SECRET'] = environ.get('API_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('CONN_STR')
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/initdb')
def init_db():
    """workaround to init the db with first admin and first chatroom"""
    first_chat = db.session.execute(
        db.select(Chatroom).order_by(Chatroom.id)).one_or_none()
    admin_user = db.session.execute(
        db.select(User).filter_by(username='admin')).one_or_none()

    if not admin_user:
        hashed_password = generate_password_hash(
            environ.get('ADMIN_PW'), method='sha256')
        admin = User(username='admin',
                     fullname='admin',
                     password=hashed_password,
                     admin=True)
        db.session.add(admin)
        db.session.commit()
        admin_user = admin

    if not first_chat:
        new_chat = Chatroom(
            name='general',
            owner_id=admin_user.id,
            owner=admin_user,
            users=[admin_user]
        )
        db.session.add(new_chat)
        db.session.commit()
        first_chat = new_chat
    data = {'data': 'Initialized. Secret token is ' + app.config['SECRET']}
    return jsonify(data)


def authenticate(func):
    """validates the jwt to authenticate the user

    Args:
        func (function): The function that needs auth

    Returns:
        function: The same function, authenticated
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'You must be logged in to access this data'}), 401
        try:
            data = jwt.decode(
                token, app.config['SECRET'], algorithms=["HS256"])
            current_user = db.session.execute(
                db.select(User).filter_by(id=data['id'])).scalars().one()
        except (jwt.InvalidIssuedAtError, jwt.ExpiredSignatureError, exc.SQLAlchemyError):
            return jsonify({'message': 'Invalid Login'}), 401
        return func(current_user, *args, **kwargs)
    return wrapper


# def authenticate_user(context):
#     if context['']


@socketio.on("connect")
def connect(sid):
    """listener for connection events"""
    # print(f"environ is {environ}")
    print(f"sid is {request.sid}")
    # username = authenticate_user(context)
    print(f"client has connected: sid: {request.sid}, username: username")
    emit("connect", {"data": f"LOG: username is connected"})


@socketio.on("disconnect")
def disconnect():
    """listener for disconnect events"""
    print("client has disconnected " + request.sid)
    emit("disconnect", {
         "data": f"id: {request.sid} has disconnected"}, broadcast=True)


@socketio.on('data')
def handle_message(data):
    """listener for data events"""
    print("data from the front end: ", type(data))
    emit("data", {'data': data, 'id': request.sid}, broadcast=True)


@socketio.on('join')
def handle_join(data):
    """listener for data events"""
    print("data from the front end: ", str(data))
    if not data['username'] or not data['token']:
        return False
    try:
        token = jwt.decode(
            data['token'], app.config['Secret'], algorithms=["HS256"])
        user = db.session.execute(db.select(User).filter_by(
            id=token['id'])).scalars().one()
    except (jwt.InvalidIssuedAtError, jwt.ExpiredSignatureError, exc.SQLAlchemyError):
        return False, 401

    emit("data", {'data': data, 'id': request.sid}, broadcast=True)


@app.route("/")
def root():
    """returns object with filler data"""
    data = {'data': 'Root accessed. Secret token is ' + app.config['SECRET']}
    return jsonify(data)


@app.route('/user')
@authenticate
def get_users(user):
    """doc string"""
    print(f"access by {user}")
    users = db.session.execute(db.select(User).order_by(User.id)).scalars()
    return jsonify({
        "users": user.username for user in users
    })


@app.route('/user', methods=['POST'])
def register():
    """this is empty"""
    data = request.get_json()
    if not data['password'] or not data['username']:
        return jsonify({'message': 'Invalid Request'}), 400
    hashed_password = generate_password_hash(data['password'], method='sha256')

    first_chatroom = db.session.execute(
        db.select(Chatroom).order_by(Chatroom.id)).scalars().first()

    if not first_chatroom:
        init_db()
        first_chatroom = db.session.execute(db.select(Chatroom)
                                            .order_by(Chatroom.id)).scalars().first()

    new_user = User(username=data['username'],
                    password=hashed_password,
                    admin=False)
    new_user.chatrooms.append(first_chatroom)
    try:
        db.session.add(new_user)
        db.session.commit()
    except exc.IntegrityError:
        return jsonify({'message': 'Invalid Username'}), 400
    return jsonify({'message': 'Registration successful', 'user': new_user.as_dict()}), 201


@app.route('/login', methods=['POST'])
def login():
    """login POST method"""
    auth = request.authorization
    bad_request = make_response('Invalid request', 401, {
                                'Authentication': 'Login required'})
    if not auth or not auth.username or not auth.password:
        return bad_request

    user = db.session.execute(
        db.select(User).filter_by(username=auth.username)).first()

    login_fail = jsonify({'message': 'Invalid username or password'}), 401
    if not user:
        return login_fail

    if check_password_hash(user[0].password, auth.password):
        token = jwt.encode(
            {
                'id': user[0].id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
            },
            app.config['SECRET'],
            "HS256")
        return jsonify({'token': str(token)})
    return login_fail


@app.route('/chat', methods=['POST'])
@authenticate
def create_chatroom(user):
    """create chatroom"""
    data = request.get_json()
    if not data['name']:
        return jsonify({'message': 'Invalid Request'}), 400
    new_chatroom = Chatroom(
        name=data['name'],
        owner_id=user.id)
    new_chatroom.users.append(user)
    if (data['users']):
        for username in data['users']:
            joining_user = db.session.execute(
                db.select(User).filter_by(username=username)
            ).scalars().one_or_none()
            if joining_user:
                new_chatroom.users.append(joining_user)
    try:
        db.session.add(new_chatroom)
        db.session.commit()
    except exc.SQLAlchemyError as err:
        return jsonify({'message': 'Invalid Username', 'e': err}), 409
    return jsonify({'message': 'Chatroom created'}), 201


@app.route('/chat/<chat_id>', methods=['GET'])
@authenticate
def get_chat_history(user, chat_id):
    """Gets the chat history if the user is in the chat or the user is an admin

    Args:
        user (User): The authenticated user making the request
        chat_id (int): ID for the chatroom to join

    Returns:
        flask.Response: The Response object
    """
    # error_response = make_response('Error processing request', 400)
    not_found = make_response('Not Found', 404)
    chatroom = db.session.execute(
        db.select(Chatroom).filter_by(id=chat_id)
    ).scalars().one_or_none()
    if not chatroom:
        return not_found
    # if not user in chatroom.users:
    #     return error_response
    print(str(chatroom))
    return jsonify(), 204


@app.route('/chat/<chat_id>', methods=['POST'])
@authenticate
def join_chat(user, chat_id):
    """Attempts to join the user to the specified chat

    Args:
        user (User): The authenticated user making the request
        chat_id (int): ID for the chatroom to join

    Returns:
        flask.Response: The Response object
    """
    error_response = make_response('Error processing request', 500)
    not_found = make_response('Not Found', 404)
    chatroom = db.session.execute(
        db.select(Chatroom).filter_by(id=chat_id)
    ).scalars().one_or_none()
    if not chatroom:
        return not_found
    chatroom.users.append(user)
    try:
        db.session.add(chatroom)
        db.session.commit()
    except exc.SQLAlchemyError as err:
        return error_response, err
    return jsonify({'message': 'Joined chatroom'}), 204


if __name__ == '__main__':
    socketio.run(app,
                 debug=True,
                 host=environ.get('APP_HOST'),
                 port=environ.get('APP_PORT'))
