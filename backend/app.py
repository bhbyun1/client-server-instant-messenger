"""Main entry point into server"""

from db.model import User, Message, Chatroom
from os import environ
from flask import Flask, request, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from functools import wraps
from sqlalchemy import exc
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv
import datetime
import jwt

load_dotenv()
app = Flask(__name__)
app.config['SECRET'] = environ.get('API_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('CONN_STR')
db = SQLAlchemy(app)
CORS(app, resources={r"/*":{"origins":"*"}})
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
            data = jwt.decode(token, app.config['SECRET'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['id']).first()
        except (jwt.InvalidIssuedAtError, jwt.ExpiredSignatureError, exc.SQLAlchemyError):
            return jsonify({'message': 'Invalid Login'}), 401
        return f(current_user, *args, **kwargs)
    return wrapper

@socketio.on("connect")
def on_connect():
    """listener for connection events"""
    print("client has connected " + request.sid)
    emit("connect",{ "data":f"id: {request.sid} is connected"})

@socketio.on("disconnect")
def on_disconnect():
    """listener for disconnect events"""
    print("client has disconnected " + request.sid)
    emit("disconnect", {"data":f"id: {request.sid} has disconnected"}, broadcast=True)

@socketio.on('data')
def handle_message(data):
    """listener for data events"""
    print("data from the front end: ",str(data))
    emit("data", {'data':data,'id':request.sid}, broadcast=True)

@app.route("/")
def root():
    """returns object with filler data"""
    data = {'data':'Root accessed. Secret token is ' + app.config['SECRET']}
    return jsonify(data)

@app.route('/user')
@authenticate
def get_users():
    """doc string"""
    users = db.session.execute(db.select(User).order_by(User.id)).scalars()
    return jsonify({
        "users" : user.name for user in users
    })

@app.route('/user', methods=['POST'])
def register():
    """this is empty"""
    data = request.get_json()
    if not data['pw'] or not data['name']:
        return jsonify({'message': 'Invalid Request'}), 400
    hashed_password = generate_password_hash(data['pw'], method='sha256')

    new_user = User(name=data['name'], pw=hashed_password, admin=False)
    try:
        db.session.add(new_user)
        db.session.commit()
    except exc.IntegrityError:
        return jsonify({'message': 'Invalid Username'}), 400
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    """login POST method"""


if __name__ == '__main__':
    socketio.run(app,
    debug=True,
    host=environ.get('APP_HOST'),
    port=environ.get('APP_PORT'))
