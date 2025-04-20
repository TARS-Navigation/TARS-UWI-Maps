from App.database import db
from .user import User

class Admin(User):
    _tablename_ = 'admin'
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
    admin_id = db.Column(db.Integer, nullable=False, unique=True)
    _mapper_args_ = {
      'polymorphic_identity': 'admin',
    }