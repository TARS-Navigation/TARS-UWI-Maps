from App.database import db
from App.models import Marker
from App.models.regular_user import RegularUser

class UserAchievements(db.Model):
    __tablename__ = 'user_achievements'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('regular_user.id'), nullable = False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievement.id'), nullable = False)
    visited = db.Column(db.Boolean, default=False)

    user = db.relationship('RegularUser', backref='user_achievements')
    achievement = db.relationship('Achievement', backref='user_achievements')

    def get_json(self):
     return {
        'id': self.achievement.id,
        'name': self.achievement.name,
        'description': self.achievement.description,
        'icon': self.achievement.icon,
        'visited': self.visited
       }