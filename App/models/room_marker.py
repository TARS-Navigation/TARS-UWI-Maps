from App.database import db

class RoomMarker(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    building_marker = db.Column(db.Integer, db.ForeignKey('marker.id'), nullable = False)
    icon = db.Column(db.String(200), nullable=False)
    

    def __init__(self, building_marker, icon):
        self.building_marker = building_marker
        self.icon = icon

    def get_json(self):
        return {
            'id': self.id,
            'building_marker': self.building_marker,
            'icon': self.icon
        }