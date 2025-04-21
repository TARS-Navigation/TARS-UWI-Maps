from App.database import db
from .user import User

class RegularUser(User):
   _tablename_ = 'regular_user'
   id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
   __mapper_args__ = {
      'polymorphic_identity': 'regular user',
   }