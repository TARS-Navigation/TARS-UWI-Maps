from App.database import db
from .user import User
from .marker import Marker

class RegularUser(User):
   __tablename__ = 'regular_user'
   id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
   markers = db.relationship('Marker', backref='regular_user', lazy = True)
   __mapper_args__ = {
      'polymorphic_identity': 'regular user',
   }

   def addUserMarker(self, latitude, longitude, icon, category):
      marker = Marker(creator_id = self.id, parent_id = None, latitude = latitude, longitude = longitude, icon = icon, globalVisibility = False, category=category)
      db.session.add(marker)
      db.session.commit()
      return marker
   
   def getUserMarker(self):
      return Marker.query.filter_by(creator_id = self.id, globalVisibility = False).all()