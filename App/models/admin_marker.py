from App.database import db


class AdminMarker(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    latitude = db.Column(db.Float, nullable = False)
    longitude = db.Column(db.Float, nullable = False)
    icon = db.Column(db.String, nullable = False)

    def __init__(self, latitude, longitude, icon):
        self.latitude = latitude
        self.longitude = longitude
        self.icon = icon


    def get_json(self):
        return{
            'id': self.id,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'icon':self.icon
        }