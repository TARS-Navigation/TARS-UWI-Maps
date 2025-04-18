from App.database import db

class Filter(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable =False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id')) #null in this case can be an admin created one(no need to track by id)
    is_global = db.Column(db.Boolean, default = False)

    creator = db.relationship('User', backref = 'filters')
    categories = db.relationship('FilterCategory', backref = 'filter', lazy = True)

    def __init__(self, creator_id):
        self.creator_id = creator_id

    def get_json(self):
        return{
            'id':self.id,
            'creator_id': self.creator_id,
            'name' : self.name,
            'is_global' : self.is_global,
            'categories' : [cat.category_name for cat in self.categories]
        }