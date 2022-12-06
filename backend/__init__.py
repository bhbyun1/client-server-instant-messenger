"""_summary_line_."""
from os import environ

from dotenv import load_dotenv

from .app import app, socketio
from .routes import *
from .sockets import *

load_dotenv()


def create_app(test_config=None):
    """Flask application factory."""
    socketio.run(app,
                 host=environ.get('APP_HOST'),
                 port=environ.get('PORT'))
