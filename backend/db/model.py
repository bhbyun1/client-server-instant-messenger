"""defines data schema"""
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table
)
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

user_chatroom_join_table = Table(
    "user_chatroom_join_table",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("chatrooms_id", ForeignKey("chatrooms.id"), primary_key=True)
)


class User(Base):
    """test user class"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(30), nullable=False, unique=True)
    fullname = Column(String(50))
    password = Column(String, nullable=False)
    admin = Column(Boolean)
    inactive = Column(DateTime)

    chatrooms = relationship(
        "Chatroom", secondary=user_chatroom_join_table, back_populates="users"
    )
    chatrooms_owned = relationship(
        "Chatroom", back_populates="owner", cascade="all, delete-orphan"
    )
    messages = relationship(
        "Message", back_populates="from_user"
    )

    def __repr__(self):
        return (
            f"User(id={self.id!r}, "
            f"name={self.username!r}, "
            f"password={self.password!r})"
        )

    def as_dict(self):
        """
        Returns the user parameters as a JSON string
        """
        user = {
            'Username': self.username,
            'Fullname': self.fullname,
            'Admin': self.admin,
            'Inactive': self.inactive,
            'ID': self.id
        }
        return user


class Chatroom(Base):
    """entity for chat rooms"""
    __tablename__ = 'chatrooms'

    id = Column(Integer, primary_key=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    name = Column(String(512), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship(
        "User", back_populates="chatrooms_owned"
    )
    users = relationship(
        "User", secondary=user_chatroom_join_table, back_populates="chatrooms"
    )
    messages = relationship(
        "Message", back_populates="chatroom"
    )

    def __repr__(self) -> str:
        return (
            f"Chatroom(public_id={self.public_id!r}, "
            f"name={self.name!r}, "
            f"owner={self.owner.username!r})"
        )

    def as_dict(self):
        """
        Returns the chatroom parameters as a dictionary
        """
        return {
            'name': self.name,
            'owner': self.owner.as_dict(),
            'users': [user.as_dict() for user in self.users],
            'public_ID': str(self.public_id),
            'messages': [m.as_dict() for m in self.messages]
        }


class Message(Base):
    """entity for chat messages"""
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True)
    sent = Column(DateTime, nullable=False)
    content = Column(String(512), nullable=False)

    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    from_user = relationship("User", back_populates="messages")

    chatroom_id = Column(Integer, ForeignKey("chatrooms.id"), nullable=False)
    chatroom = relationship("Chatroom", back_populates="messages")

    def __repr__(self) -> str:
        return f"Message(id={self.id!r})"

    def as_dict(self):
        """
        Returns the chatroom parameters as a dictionary
        """
        return {
            'id': self.id,
            'sent': self.sent.isoformat(),
            'owner': self.from_user.username,
            'chatroom': str(self.chatroom.public_id),
            'content': self.content
        }


Base.registry.configure()
