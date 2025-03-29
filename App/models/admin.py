from App.database import db
from .user import User

class Admin(User):
    admin_id = db.Column(db.String(120), nullable=False, unique= True)
    def __init__(self, username, email, password, admin_id,):
        super().__init__(username, email, password)
        self.admin_id = admin_id
    
    def __repr__(self):
        return f'<Admin {self.username}>'