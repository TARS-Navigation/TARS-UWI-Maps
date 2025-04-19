from App.database import db

class Marker(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    parent_id = db.Column(db.Integer, db.ForeignKey('marker.id'), nullable = True)
    latitude = db.Column(db.Float, nullable = False, unique = False )
    longitude = db.Column(db.Float, nullable = False, unique = False)
    icon = db.Column(db.String(200), nullable = False)
    globalVisibility = db.Column(db.Boolean, nullable = False, default = False)
    category = db.Column(db.String(50), nullable=False)

    def __init__(self, creator_id, parent_id, latitude, longitude, icon, globalVisibility, category):
        self.creator_id = creator_id
        self.parent_id = parent_id
        self.latitude = latitude
        self.longitude = longitude
        self.icon = icon
        self.globalVisibility = globalVisibility
        self.category = category

    def get_json(self):
        return {
        'id': self.id,
        'creator_id': self.creator_id,
        'parent_id': self.parent_id,
        'latitude': self.latitude,
        'longitude': self.longitude,
        'icon': self.icon,
        'globalVisibility': self.globalVisibility,
        'category': self.category
    }

    def getChildMarkers(self):
         child_markers = Marker.query.filter_by(parent_id=self.id).all()
         return [marker.get_json() for marker in child_markers]