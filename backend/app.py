"""Main entry point into server"""
from os import environ

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

load_dotenv()
app = Flask(__name__)
app.config['SECRET'] = environ.get('API_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('CONN_STR')
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


if __name__ == '__main__':
    from routes import *
    from sockets import *
    socketio.run(app,
                 debug=True,
                 host=environ.get('APP_HOST'),
                 port=environ.get('APP_PORT'))
