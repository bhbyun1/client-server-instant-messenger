import jwt
from flask import request
from flask_socketio import emit, join_room
from sqlalchemy import exc
from app import socketio, app, db
from db.model import User, Chatroom, Message
import datetime


@socketio.on("connect")
def connect():
    """listener for connection events"""
    # username = authenticate_user(context)
    print(f"client has connected: sid: {request.sid}")
    emit("connect", {"data": f"LOG: username is connected with {request.sid}"})


@socketio.on("disconnect")
def disconnect():
    """listener for disconnect events"""
    print("client has disconnected " + request.sid)
    emit("disconnect", {
         "data": f"id: {request.sid} has disconnected"}, broadcast=True)


@socketio.on('data')
def handle_data(data):
    """listener for data events"""
    print("data from the front end: ", data)
    emit("data", {'data': data, 'id': request.sid}, broadcast=True)
    handle_join(data)


@socketio.on('join')
def handle_join(data):
    """listener for data events"""
    if not data['token']:
        return False
    try:
        token = jwt.decode(
            data['token'], app.config['SECRET'], algorithms=["HS256"])
        user = db.session.execute(db.select(User).filter_by(
            id=token['id'])).scalars().one()
    except (jwt.InvalidIssuedAtError,
            jwt.ExpiredSignatureError,
            exc.SQLAlchemyError):
        return False, 401
    for room in user.chatrooms:
        join_room(str(room.public_id))
    chatroom_list = [room.as_dict() for room in user.chatrooms]
    emit("join", {'message': "Subscribed to all channels.",
                  "chatrooms": chatroom_list},
         to=request.sid)


@socketio.on('message')
def handle_message(data):
    if not data['token'] or not data['content'] or not data['public_id']:
        print("not token or content or pubid")
        return False
    try:
        token = jwt.decode(
            data['token'], app.config['SECRET'], algorithms=["HS256"])
        user = db.session.execute(db.select(User).filter_by(
            id=token['id'])).scalars().one()
        chatroom = db.session.execute(
            db.select(Chatroom).filter_by(public_id=data['public_id'])
        ).scalars().one_or_none()
        if user not in chatroom.users:
            print(f"User: {user} is not a member of chatroom: {chatroom}")
            return False
    except (jwt.InvalidIssuedAtError,
            jwt.ExpiredSignatureError,
            exc.SQLAlchemyError) as e:
        print(e)
        return False
    message = Message(
        sent=datetime.datetime.now(),
        content=data['content'],
        from_user_id=user.id,
        chatroom_id=chatroom.public_id
    )
    message.from_user = user
    message.chatroom = chatroom
    try:
        db.session.add(message)
        db.session.commit()
    except exc.SQLAlchemyError as err:
        print(err)
        return False, err
    emit('message', message.as_dict(), to=data['public_id'])


@socketio.on('history')
def return_chat_history(data):
    if not data['token'] or not data['public_id']:
        print("not token or content or pubid")
        return False
    try:
        token = jwt.decode(
            data['token'], app.config['SECRET'], algorithms=["HS256"])
        user = db.session.execute(db.select(User).filter_by(
            id=token['id'])).scalars().one()
        chatroom = db.session.execute(
            db.select(Chatroom).filter_by(public_id=data['public_id'])
        ).scalars().one_or_none()
        if user not in chatroom.users:
            print(f"User: {user} is not a member of chatroom: {chatroom}")
            return False
    except (jwt.InvalidIssuedAtError,
            jwt.ExpiredSignatureError,
            exc.SQLAlchemyError) as e:
        print(e)
        return False
    emit("history", chatroom.as_dict(), to=request.sid)
