"""Main entry point into server"""

import datetime
from functools import wraps
from os import environ
from flask import Flask, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from sqlalchemy import exc
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import jwt
from db.model import User, Message, Chatroom

load_dotenv()
app = Flask(__name__)
app.config['SECRET'] = environ.get('API_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('CONN_STR')
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


def authenticate(func):
    """Wrapper function to authenticate routes"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'You must be logged in to access this page'}), 401
        try:
            data = jwt.decode(
                token, app.config['SECRET'], algorithms=["HS256"])
            current_user = db.session.execute(
                db.select(User).filter_by(id=data['id'])).one()
        except (jwt.InvalidIssuedAtError, jwt.ExpiredSignatureError, exc.SQLAlchemyError):
            return jsonify({'message': 'Invalid Login'}), 401
        return func(current_user, *args, **kwargs)
    return wrapper


@socketio.on("connect")
def on_connect():
    """listener for connection events"""
    print("client has connected " + request.sid)
    emit("connect", {"data": f"id: {request.sid} is connected"})


@socketio.on("disconnect")
def on_disconnect():
    """listener for disconnect events"""
    print("client has disconnected " + request.sid)
    emit("disconnect", {
         "data": f"id: {request.sid} has disconnected"}, broadcast=True)


@socketio.on('data')
def handle_message(data):
    """listener for data events"""
    print("data from the front end: ", str(data))
    emit("data", {'data': data, 'id': request.sid}, broadcast=True)


@app.route("/")
def root():
    """returns object with filler data"""
    ##################################################
    # TEMP TO CLEAR USERS AS MODEL IS BEING UPDATED
    ##################################################
    # This deletes all the users from the Users table
    # try:
    #     db.session.query(User).delete()
    #     db.session.commit()
    #     print("users deleted")
    # except:
    #     db.session.rollback()
    #     print("users not deleted")
    ##################################################
    # END TEMP
    ##################################################

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

    new_user = User(username=data['username'],
                    password=hashed_password, admin=False)
    try:
        db.session.add(new_user)
        db.session.commit()
    except exc.IntegrityError:
        return jsonify({'message': 'Invalid Username'}), 400
    return jsonify({'message': 'Registration successful', 'user': new_user.as_json_string()}), 201


@app.route('/login', methods=['POST'])
def login():
    """login POST method"""
    auth = request.authorization
    bad_request = make_response('Invalid request', 401, {
                                'Authentication': 'Login required'})
    if not auth or not auth.username or not auth.password:
        return bad_request

    user = db.session.execute(
        db.select(User).filter_by(username=auth.username)).one()
    print(f"user is {user}")
    if check_password_hash(user[0].password, auth.password):
        token = jwt.encode(
            {
                'id': user[0].id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60)
            },
            app.config['SECRET'],
            "HS256")
        return jsonify({'token': token})
    return bad_request


if __name__ == '__main__':
    socketio.run(app,
                 debug=True,
                 host=environ.get('APP_HOST'),
                 port=environ.get('APP_PORT'))
