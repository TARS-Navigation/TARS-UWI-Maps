from App.database import db
from .user import User

class RegularUser(User):
   _tablename_ = 'regular_user'
   id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
   _mapper_args_ = {
      'polymorphic_identity': 'regular user',
   }