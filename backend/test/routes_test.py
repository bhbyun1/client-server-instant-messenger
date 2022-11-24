from app import app
from requests.auth import _basic_auth_str


def test_index():
    """Test index route"""
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200


def test_get_users():
    """Test get users route"""
    client = app.test_client()
    response = client.get('/users')
    assert response.status_code == 200


def test_post_users():
    """Test post users route"""
    client = app.test_client()
    response = client.post(
        '/users', headers={'Authorization': 'Basic ' + _basic_auth_str('testtest', 'testtest')})
    assert response.status_code == 201


def test_login():
    """Test login route"""
    client = app.test_client()
    response = client.post('/login',
