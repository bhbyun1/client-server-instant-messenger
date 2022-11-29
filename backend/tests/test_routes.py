"""
The routes test file.

Includes all the unit tests for RESTful API routes.
"""

import pytest

from requests.auth import _basic_auth_str

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
    response = client.get('/users')
    assert response.status_code == 200


def test_post_users(client):
    """Test post users route."""
    response = client.post(
        '/users', headers={'Authorization': 'Basic ' +
                           _basic_auth_str('testtest', 'testtest')})
    assert response.status_code == 201


# def test_login():
#     """Test login route"""
#     client = app.test_client()
#     response = client.post('/login',
