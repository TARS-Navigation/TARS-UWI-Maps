from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.controllers.filter import *

filters_views = Blueprint('filters_views', __name__, template_folder='../templates')

@filters_views.route('/filters', methods = ['GET'])
@jwt_required()
def get_filters():
    user_id = get_jwt_identity()
    filters = get_all_filters(user_id)
    return filters, 200

@filters_views.route('/filters/<int:id>', methods=['GET'])
@jwt_required()
def get_filter(id):
  filter = get_filter_by_id(id)
  if filter:
    return filter, 200
  return filter({'message': 'Filter not found'}), 404

@filters_views.route('/filters', methods=['POST'])
@jwt_required()
def add_filter():
    data = request.json
    creator_id = get_jwt_identity()
    filter = create_filter(
        name = data['name'],
        creator_id= creator_id,
    )
    return filter, 201

@filters_views.route('/filters/<int:id>', methods=['PUT'])
@jwt_required()
def update_filter_route(id):
  data = request.json
  updated_filter = update_filter(
    id = id,
    name = data['name'],
    marker_ids = data['marker_ids']
  )
  if updated_filter:
    return jsonify(updated_filter), 200
  return jsonify({'message': 'Filter not found'}), 404

@filters_views.route('/filters/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_filter_route(id):
  if delete_filter(id):
    return jsonify({'message': 'Filter deleted'}), 200
  return jsonify({'message': 'Filter not found'}), 404

