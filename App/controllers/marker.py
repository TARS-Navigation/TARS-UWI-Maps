from App.models import Marker, User, Filter
from App.database import db 

def get_all_markers(user_id):
  user = User.query.get(user_id)
  markers = list(Marker.query.filter_by(is_global = True))

  if user.is_admin is not True:
    markers += user.get_markers()

  return [marker.get_json() for marker in markers]

def get_marker_by_id(id):
  marker = Marker.query.get(id)
  return marker.get_json() if marker else None

def get_marker_filters(id):
  marker = Marker.query.get(id)
  return [filter.get_json() for filter in marker.filters]

def create_marker(name, creator_id, parent_id, lattitude, longitude, icon, description, filter_names):
  user = User.query.get(creator_id)
  marker = Marker(
    name = name,
    creator_id = creator_id,
    parent_id = parent_id,
    lattitude = lattitude,
    longitude = longitude,
    icon = icon,
    description= description,
    is_global = user.is_admin
  )

  for filter_name in filter_names:
    filter = Filter.query.filter_by(name = filter_name).first()
    marker.filters.append(filter)
  
  db.session.add(marker)
  db.session.commit()
  return marker.get_json()

def add_marker_filter(id, filter):
  marker = Marker.query.get(id)
  marker.filters.append(filter)
  db.session.add(marker)
  db.session.commit()
  return marker.get_json()

def update_marker(id, lattitude=None, longitude=None, icon=None, filter_name=None):
  marker = Marker.query.get(id)
  if marker:
    if lattitude is not None:
      marker.lattitude = lattitude
    if longitude is not None:
      marker.longitude = longitude
    if icon is not None:
      marker.icon = icon
    if filter_name is not None:
      filter = Filter.query.filter_by(name = filter_name)
      marker.filters.clear()
      marker.filters.append(filter)
    db.session.commit()
    return marker.get_json()
  return None

def delete_marker(id):
  marker = Marker.query.get(id)
  if marker:
    db.session.delete(marker)
    db.session.commit()
    return True
  return False