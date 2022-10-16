"""defines data schema"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    """test user class"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(30))
    fullname = Column(String)

    def __repr__(self):
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r})"

Base.registry.configure()
