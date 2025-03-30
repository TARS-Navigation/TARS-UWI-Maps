from App.database import db
from .user import User

class OutsideUser(User):
    def __init__(self, username, password):
        super().__init__(username, password)