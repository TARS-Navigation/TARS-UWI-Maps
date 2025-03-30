from App.database import db
from .user import User
from .room_marker import RoomMarker
from .user_marker import Marker

class Admin(User):
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key = True)

    def addBuildingMarker(self, latitude, longitude, icon):
        buildingMarker = Marker(creator_id = self.id, parent_id = None, latitude = latitude, longitude = longitude, icon = icon, globalVisibility = True)
        db.session.add(buildingMarker)
        db.session.commit()
        return buildingMarker
    
    def addRoomMarker(self, buildingMarker_id, icon):
        roomMarker = RoomMarker(building_marker=buildingMarker_id, icon=icon)
        db.session.add(roomMarker)
        db.session.commit()
        return roomMarker
    

