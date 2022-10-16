"""Main entry point into server"""

from os import environ
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
app.config['SECRET'] = environ.get('api-token')
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

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
    data = {'data':'Root accessed. Secret token is ' + environ.get('api-token')}
    return jsonify(data)

@app.route('/route_name', methods=['GET', 'POST'])
def method_name():
    """this is empty"""
    
@app.route('/login', methods=['POST'])
def login():
    """login POST method"""


if __name__ == '__main__':
    socketio.run(app, debug=True)
