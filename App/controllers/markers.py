from App.models import Marker
from App.database import db 

def get_all_markers():
  markers = Marker.query.all()
  return [marker.get_json() for marker in markers]

def get_marker_by_id(id):
  marker = Marker.query.get(id)
  return marker.get_json() if marker else None

def create_marker(creator_id, parent_id, latitude, longitude, icon, global_visibility, category):
  marker = Marker(
    creator_id = creator_id,
    parent_id = parent_id,
    latitude = latitude,
    longitude = longitude,
    icon = icon,
    globalVisibility = global_visibility,
    category = category
  )
  db.session.add(marker)
  db.session.commit()
  return marker.get_json()

def update_marker(id, latitude=None, longitude=None, icon=None, global_visibility=None, category=None):
  marker = Marker.query.get(id)
  if marker:
    if latitude is not None:
      marker.latitude = latitude
    if longitude is not None:
      marker.longitude = longitude
    if icon is not None:
      marker.icon = icon
    if global_visibility is not None:
      marker.globalVisibility = global_visibility
    if category is not None:
      marker.category = category
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