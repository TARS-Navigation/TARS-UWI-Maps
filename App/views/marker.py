from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.controllers.markers import *
from App.models.marker import Marker
from App.database import db


marker_views = Blueprint('marker_views', __name__)

@marker_views.route('/markers', methods=['GET'])
def get_markers():
  markers = get_all_markers()
  return jsonify(markers), 200

@marker_views.route('/markers/<int:id>', methods=['GET'])
def get_marker(id):
  marker = get_marker_by_id(id)
  if marker:
    return jsonify(marker), 200
  return jsonify({'message': 'Marker not found'}), 404

@marker_views.route('/markers', methods=['POST'])
@jwt_required()
def add_marker():
    data = request.json
    creator_id = get_jwt_identity()
    marker = create_marker(
        creator_id=creator_id,
        parent_id=data.get('parent_id'),
        latitude=data['latitude'],
        longitude=data['longitude'],
        icon=data['icon'],
        global_visibility=data.get('global_visibility', False),
        category=data['category']
    )
    return jsonify(marker), 201

@marker_views.route('/markers/<int:id>', methods=['PUT'])
@jwt_required()
def update_marker_route(id):
  data = request.json
  updated_marker = update_marker(
    id = id,
    latitude = data.get('latitude'),
    longitude = data.get('longitude'),
    icon = data.get('icon'),
    global_visibility = data.get('global_visibility'),
    category = data.get('category')
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
  