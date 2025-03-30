from App.database import db

class Filter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)

    def __init__(self, creator_id):
        self.creator_id = creator_id

    def get_json(self):
        return{
            'id':self.id,
            'creator_id': self.creator_id
        }