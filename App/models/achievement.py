from App.database import db
from App.models import Marker

class Achievement(db.Model):
    __tablename__ = 'achievement'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), nullable = False, unique = False)
    description = db.Column(db.String(100), nullable = False, unique = False) #description can be anything - for example  Studious (name) - Visited the library (description) 
    icon = db.Column(db.String(200), nullable = False, unique = False) # each should have an icon, to match map ui and maybe pixelated to give a "game feel"
    marker_id = db.Column(db.Integer, db.ForeignKey('marker.id')) #some markers that give achievements, not all.  eg food court, library, fst

    def get_json(self):
     return {
        'id': self.id,
        'name': self.name,
        'description': self.description,
        'icon': self.icon,
        'marker_id': self.marker_id
     }