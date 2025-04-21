from .user import create_user
from App.models import Admin, Marker, Filter,  RegularUser
from App.database import db
from App.models import Achievement

def initialize():
    db.drop_all()
    db.create_all()
    # Create admin user
    admin = Admin(username='bob', password='bobpass') # login admin using bob and bobpass
    admin.admin_id = 1  #  admin ID


    test = RegularUser(username='richard', password='test')
    db.session.add(test)


    filter1 = Filter(creator_id= None, name = "Science and Technology", is_global=True)
    filter2 = Filter(creator_id= None, name = "Social Sciences", is_global=True)
    filter3 = Filter(creator_id= None, name = "Food and Agriculture", is_global=True)
    filter4 = Filter(creator_id= None, name = "Law", is_global=True)
    filter5 = Filter(creator_id= None, name = "Engineering", is_global=True)
    filter6 = Filter(creator_id= None, name = "Recreation", is_global=True)

    filters = [filter1, filter2, filter3, filter4, filter5, filter6]
    db.session.add_all(filters)

    marker1 = Marker(name = "hi",creator_id= 1, parent_id=None, lattitude=10.6432808853968, longitude=-61.40189930904827, description="asd", icon=None, is_global=True)
    marker2 = Marker(name = "hi",creator_id= 1, parent_id=None, lattitude=10.644304196435085, longitude=-61.40023657791617, description="asd", icon=None, is_global=True)
    marker3 = Marker(name = "hi",creator_id= 1, parent_id=None, lattitude=10.642574060302948, longitude=-61.398606028676966, description="asd", icon=None, is_global=True)

    markers = [marker1, marker2, marker3]

    marker1.filters.append(filter1)
    marker2.filters.append(filter1)
    marker3.filters.append(filter2)

    db.session.add_all(markers)
    db.session.add(admin)
    db.session.commit()

    achievement1 = Achievement(
        name="Studious",
        description="Visited marker1",
        icon="/static/images/achievement-default.jpg",
        marker_id=marker1.id
    )

    
    achievement2 = Achievement(
        name="Venturer",
        description="Visited marker 2",
        icon="/static/images/achievement-default.jpg",
        marker_id=marker2.id
    )

    db.session.add_all([achievement1, achievement2])


    db.session.commit()