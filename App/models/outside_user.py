from App.database import db
from .user import User

class OutsideUser(User):
    def __init__(self, username, email, password):
        super().__init__(username, email, password)