from App.models import Filter
from App.database import db

def get_all_filters():
    filters = Filter.query.all()
    return [filter.get_json() for filter in filters]

def get_filter_by_id(id):
    filter = Filter.query.get(id)
    return filter.get_json() if filter else None

def get_filter_markers(id):
   filter = Filter.query.get(id)
   return [marker.get_json() for marker in filter.markers]

def create_filter(creator_id, name, is_global):
    filter = Filter(
        creator_id= creator_id,
        name= name,
        is_global=is_global
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

def update_filter(id, name):
  filter = Filter.query.get(id)
  if filter and name is not None:
    filter.name = name
    db.session.commit()
    return filter.get_json()
  return None

def delete_filter(id):
  filter = Filter.query.get(id)
  if filter:
    db.session.delete(filter)
    db.session.commit()
    return True
  return False