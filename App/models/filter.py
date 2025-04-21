from App.database import db

class Filter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable =False, unique = True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = True) 
    is_global = db.Column(db.Boolean, default = False)

    creator = db.relationship('User', backref = 'filters')

    def __init__(self, creator_id, name, is_global):
        self.creator_id = creator_id
        self.name = name
        self.is_global = is_global
    def get_filter_json(self):
        return{
            'id':self.id,
            'creator_id': self.creator_id,
            'name' : self.name,
            'is_global' : self.is_global,
        }

    def get_json(self):
        return{
            'id':self.id,
            'creator_id': self.creator_id,
            'name' : self.name,
            'is_global' : self.is_global,
            'markers' : [marker.get_marker_json() for marker in self.markers]
        }