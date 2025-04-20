from flask import Blueprint, request, jsonify
from App.models import Marker

filters_views = Blueprint('filters_views', __name__, template_folder='../templates')

@filters_views.route('/app/markers')
def get_filtered_markers():
    categories = request.args.getlist('categories')
    if not categories:
        return jsonify("Error no categories found")
    
    markers = []
    all_markers = Marker.query.all()

    for marker in all_markers:
        if marker.category in categories:
            markers.append(marker.get_json())

    return jsonify(markers)

