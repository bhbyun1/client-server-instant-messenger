"""Main entry point into server."""
from os import environ

from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.config['SECRET'] = environ.get('API_TOKEN')
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('CONN_STR')
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)
