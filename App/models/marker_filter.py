from App.database import db
class MarkerFilter(db.Model):
    _tablename_ = 'marker_filter'
    id = db.Column(db.Integer, primary_key = True)
    filter_id = db.Column(db.Integer, db.ForeignKey('filter.id'), nullable = False)
    marker_id = db.Column(db.Integer, db.ForeignKey('marker.id'), nullable = False)


    def get_json(self):
        return{
            'id': self.id,
            'filter_id': self.filter_id,
            'category_name' : self.category_name
        }