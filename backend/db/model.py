"""defines data schema"""
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Boolean, DateTime
from sqlalchemy.orm import declarative_base, relationship

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
    name = Column(String(30), nullable=False)
    pw = Column(String, nullable=False)
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
        return f"User(id={self.id!r}, name={self.name!r})"

class Chatroom(Base):
    """entity for chat rooms"""
    __tablename__ = 'chatrooms'

    id = Column(Integer, primary_key=True)
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
        return f"Chatroom(id={self.id!r}, name={self.name!r}, owner={self.owner.name!r})"

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



Base.registry.configure()
