"""_summary_line_."""
from os import environ

from dotenv import load_dotenv
from flask_cors import CORS

from .app import app, socketio
from .routes import *
from .sockets import *

load_dotenv()


def create_app(test_config=None):
    """Flask application factory."""
    CORS(app, resources={r"/*": {"origins": "*"}})
    socketio.run(app,
                 debug=True,
                 host=environ.get('APP_HOST'),
                 port=environ.get('APP_PORT'))
