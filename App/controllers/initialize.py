from .user import create_user
from App.models import Admin
from App.database import db

def initialize():
    db.drop_all()
    db.create_all()
    # Create admin user
    admin = Admin(username='bob', password='bobpass') # login admin using bob and bobpass
    admin.admin_id = 1  #  admin ID
    db.session.add(admin)
    db.session.commit()