"""
The routes test file.

Includes all the unit tests for RESTful API routes.
"""
import base64
import json
import pytest
import uuid

from ..app import app as a


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


def test_index(client):
    """Test index route."""
    response = client.get('/')
    assert response.status_code == 200


def test_get_users(client):
    """Test get users route."""
    response = client.get('/user')
    assert response.status_code == 401


def test_post_users(client):
    """Test post users route."""
    username = str(uuid.uuid4())[:29]
    response = client.post(
        '/user',
        headers={'Content-Type': 'application/json'},
        json={
            'username': username,
            'password': 'test',
        })
    assert response.status_code == 201


def test_init_db(client):
    """Test init db route."""
    response = client.get('/initdb')
    assert response.status_code == 200


def test_login(client):
    """Test login route"""
    response = client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))})
    assert response


def test_create_chatroom_fail(client):
    """Test create chatroom route."""
    login = json.loads(client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))}
    ).get_data())['token']
    response = client.post(
        '/chat', headers={"x-access-token": login})
    assert response.status_code == 400


def test_get_chat_history(client):
    """Test get chat history route."""
    response = client.get('/chat/1')
    assert response.status_code == 401


def test_get_chatrooms(client):
    """Test get chatrooms route."""
    login = json.loads(client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))}
    ).get_data())['token']
    response = client.get('/chat', headers={"x-access-token": login})
    assert response.status_code == 200


def test_join_chat_fail(client):
    """_summary_

    Args:
        client (_type_): _description_
    """
    fake_id = str(uuid.uuid4())
    login = json.loads(client.post(
        '/login',
        headers={
            "Authorization": "Basic {}"
            .format(base64.b64encode(b"test:test").decode("utf8"))}
    ).get_data())['token']
    response = client.post(
        f'/chat/{fake_id}', headers={"x-access-token": login})
    assert response.status_code == 404
