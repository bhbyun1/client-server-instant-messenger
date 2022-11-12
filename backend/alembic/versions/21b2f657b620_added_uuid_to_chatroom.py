"""Added UUID to chatroom

Revision ID: 21b2f657b620
Revises: 7c687f15a1e3
Create Date: 2022-11-11 14:54:49.594512

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '21b2f657b620'
down_revision = '7c687f15a1e3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chatrooms', sa.Column('public_id', postgresql.UUID(as_uuid=True), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('chatrooms', 'public_id')
    # ### end Alembic commands ###