from App.models import Filter, User, Marker
from App.database import db

def get_all_filters(user_id):
    filters = list(Filter.query.filter_by(is_global = True))
    user = User.query.get(user_id)

    if user.is_admin is not True:
       filters += user.get_filters()

    return [filter.get_json() for filter in filters]

def get_filter_by_id(id):
    filter = Filter.query.get(id)
    return filter.get_json() if filter else None

def get_filter_markers(id):
   filter = Filter.query.get(id)
   return [marker.get_json() for marker in filter.markers]

def create_filter(creator_id, name):
    user = User.query.get(creator_id)
    filter = Filter(
        creator_id= creator_id,
        name= name,
        is_global=user.is_admin
    )
    db.session.add(filter)
    db.session.commit()
    return filter.get_json()

def add_filter_marker(id, marker):
   filter = Filter.query.get(id)
   filter.markers.append(marker)
   db.session.add(filter)
   db.session.commit()
   return filter.get_json()

def update_filter(id, name, marker_ids):
  filter = Filter.query.get(id)
  if filter and name is not None:
    filter.name = name

  for marker_id in marker_ids:
     marker = Marker.query.get(marker_id)
     filter.markers.append(marker)
     
  db.session.add(filter)
  db.session.commit()
  return filter.get_json()

def delete_filter(id):
  filter = Filter.query.get(id)
  if filter:
    db.session.delete(filter)
    db.session.commit()
    return True
  return False