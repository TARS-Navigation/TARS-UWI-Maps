from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.controllers.marker import *


marker_views = Blueprint('marker_views', __name__)

@marker_views.route('/markers', methods=['GET'])
@jwt_required()
def get_markers():
  user_id = get_jwt_identity()
  markers = get_all_markers(user_id)
  print("MARKERS JSON:", markers)
  return jsonify(markers), 200

@marker_views.route('/markers/<int:id>', methods=['GET'])
@jwt_required()
def get_marker(id):
  marker = get_marker_by_id(id)
  if marker:
    return marker, 200
  return jsonify({'message': 'Marker not found'}), 404

@marker_views.route('/markers', methods=['POST'])
@jwt_required()
def add_marker():
    data = request.json
    creator_id = get_jwt_identity()
    marker = create_marker(
        name = data['name'],
        creator_id=creator_id,
        parent_id=data['parent_id'],
        lattitude=data['lattitude'],
        longitude=data['longitude'],
        icon=data['icon'],
        description= data['description'],
        filter_names=data['filter_names']
    )
    return marker, 201

@marker_views.route('/markers/<int:id>', methods=['PUT'])
@jwt_required()
def update_marker_route(id):
  data = request.json
  updated_marker = update_marker(
    id = id,
    lattitude = data.get('lattitude'),
    longitude = data.get('longitude'),
    icon = data.get('icon'),
    global_visibility = data.get('global_visibility'),
    filter_name = data.get('filter_name')
  )
  if updated_marker:
    return jsonify(updated_marker), 200
  return jsonify({'message': 'Marker not found'}), 404

@marker_views.route('/markers/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_marker_route(id):
  if delete_marker(id):
    return jsonify({'message': 'Marker deleted'}), 200
  return jsonify({'message': 'Marker not found'}), 404