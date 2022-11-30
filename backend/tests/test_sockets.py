import base64
import json
import pytest

from ..app import socketio as s, app as a


@pytest.fixture()
def app():
    """_summary_.

    Yields:
        _type_: _description_
    """
    return_app = a
    return_app.config.update({
        "TESTING": True,
    })

    # Other setup

    # Yield the app
    return return_app

    # Clean up


@pytest.fixture()
def client(app):
    """_summary_.

    Args:
        app (_type_): _description_

    Returns:
        _type_: _description_
    """
    return app.test_client()


@pytest.fixture()
def runner(app):
    """_summary_.

    Args:
        app (_type_): _description_

    Returns:
        _type_: _description_
    """
    return app.test_cli_runner()


def test_connect_and_disconnect(client):
    """Test connect route."""
    socketio_client = s.test_client(a)
    assert socketio_client.is_connected()
    socketio_client.disconnect()
    assert socketio_client.is_connected() is False


def test_join_fail(client):
    """Test join route."""
    socketio_client = s.test_client(a)
    socketio_client.emit('join', {'token': 'test_token'})
    socketio_client.get_received()
    assert not socketio_client.get_received()


def test_messsage_no_content(client):
    """Test message route."""
    socketio_client = s.test_client(a)
    socketio_client.emit(
        'message', {'token': 'test_token', 'public_id': 'test_public_id'})
    socketio_client.get_received()
    assert not socketio_client.get_received()


def test_messsage_no_public_id(client):
    """Test message route."""
    socketio_client = s.test_client(a)
    socketio_client.emit(
        'message', {'token': 'test_token', 'content': 'test_content'})
    socketio_client.get_received()
    assert not socketio_client.get_received()


def test_messsage_no_token(client):
    """Test message route."""
    socketio_client = s.test_client(a)
    socketio_client.emit(
        'message', {'public_id': 'test_public_id', 'content': 'test_content'})
    socketio_client.get_received()
    assert not socketio_client.get_received()


def test_message_success(client):
    """_summary_

    Args:
        client (_type_): _description_
    """
    login = json.loads(client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))}
    ).get_data())['token']
    chat_id = json.loads(client.get(
        '/chat',
        headers={
            'x-access-token': login
        }).get_data())['chatrooms'][0]['public_id']
    socketio_client = s.test_client(a)
    socketio_client.get_received()
    socketio_client.emit(
        'join',
        {'token': login})
    socketio_client.emit(
        'message',
        {
            'token': f'{login}',
            'public_id': f'{chat_id}',
            'content': 'test_content'
        })
    recieved = socketio_client.get_received()
    assert recieved[-1]['name'] == 'message'


def test_chat_history(client):
    """_summary_"""
    login = json.loads(client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))}
    ).get_data())['token']
    chat_id = json.loads(client.get(
        '/chat',
        headers={
            'x-access-token': login
        }).get_data())['chatrooms'][0]['public_id']
    socketio_client = s.test_client(a)
    socketio_client.get_received()
    socketio_client.emit(
        'history',
        {
            'token': f'{login}',
            'public_id': f'{chat_id}',
        })
    recieved = socketio_client.get_received()
    assert recieved[-1]['name'] == 'history'
