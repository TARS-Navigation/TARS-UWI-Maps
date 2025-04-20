from werkzeug.security import check_password_hash, generate_password_hash
from App.database import db
from .marker import Marker

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username =  db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)
    type = db.Column(db.String(50))
    _mapper_args_ = {'polymorphic_identity': 'user', 'polymorphic_on': type}

    def _init_(self, username, password):
        self.username = username
        self.set_password(password)

    @property
    def is_admin(self):
        return self.type == 'admin'

    def get_markers(self):
        return Marker.query.filter_by(creator_id = self.id)

    def get_json(self):
        return{
            'id': self.id,
            'username': self.username
        }

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)