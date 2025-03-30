from App.database import db
from .user import User
from .user_marker import Marker

class RegularUser(User):
   id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)
   markers = db.relationship('Marker', backref='regular_user', lazy = True)

   def addUserMarker(self, latitude, longitude, icon):
      marker = Marker(creator_id = self.id, parent_id = None, latitude = latitude, longitude = longitude, icon = icon, globalVisibility = False)
      db.session.add(marker)
      db.session.commit()
      return marker
   
   def getUserMarker(self):
      return Marker.query.filter_by(creator_id = self.id, globalVisibility = False).all()