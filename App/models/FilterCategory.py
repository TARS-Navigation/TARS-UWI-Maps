from App.database import db
class FilterCategory(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    filter_id = db.Column(db.Integer, db.ForeignKey('filter.id'), nullable = False)
    category_name = db.Column(db.String(50), nullable = False)

    def get_json(self):
        return{
            'id': self.id,
            'filter_id': self.filter_id,
            'category_name' : self.category_name
        }
