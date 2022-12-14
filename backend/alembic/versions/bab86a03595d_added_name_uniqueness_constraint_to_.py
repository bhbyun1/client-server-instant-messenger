"""Added name uniqueness constraint to user and fullname field

Revision ID: bab86a03595d
Revises: 71d72a921a92
Create Date: 2022-11-03 17:28:00.046070

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bab86a03595d'
down_revision = '71d72a921a92'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('fullname', sa.String(length=50), nullable=True))
    op.create_unique_constraint(None, 'users', ['name'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'fullname')
    # ### end Alembic commands ###
