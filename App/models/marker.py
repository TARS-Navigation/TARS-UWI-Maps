from App.database import db

class Marker(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(200), nullable = False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False) 
    parent_id = db.Column(db.Integer, db.ForeignKey('marker.id'), nullable = True, default = None)
    lattitude = db.Column(db.Float, nullable = False, unique = False )
    longitude = db.Column(db.Float, nullable = False, unique = False)
    description = db.Column(db.String(500), nullable = False)
    icon = db.Column(db.String(200), nullable = True)
    is_global = db.Column(db.Boolean, nullable = True, default = False)

    creator = db.relationship('User', backref = 'markers')
    filters = db.relationship('Filter', secondary = "marker_filter", backref = 'markers', lazy = True)
    achievement = db.relationship('Achievement', backref='marker', uselist=False, lazy='joined')

    def __init__(self, name, creator_id, parent_id, lattitude, longitude, description, icon, is_global):
        self.creator_id = creator_id
        self.name = name
        self.parent_id = parent_id
        self.lattitude = lattitude
        self.longitude = longitude
        self.description = description
        self.icon = icon
        self.is_global = is_global

    def get_json(self):
        achievement_id = self.achievement.id if self.achievement else None

        return {
        'id': self.id,
        'name' : self.name,
        'creator_id': self.creator_id,
        'parent_id': self.parent_id,
        'lattitude': self.lattitude,
        'longitude': self.longitude,
        'description': self.description,
        'icon': self.icon,
        'is_global': self.is_global,
        'filters' : [filter.get_json() for filter in self.filters],
        'achievement_id': achievement_id 
    }

    def getChildMarkers(self):
         child_markers = Marker.query.filter_by(parent_id=self.id).all()
         return [marker.get_json() for marker in child_markers]