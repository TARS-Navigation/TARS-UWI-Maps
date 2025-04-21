from flask import Blueprint, render_template, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.models import RegularUser, Admin, Achievement
from App.models.user_achievements import UserAchievements
from App.database import db

achievement_views = Blueprint('achievements_views', __name__, template_folder='../templates')


@achievement_views.route('/achievements', methods=['GET'])
@jwt_required()
def achievements_page():
    user_id = get_jwt_identity()

    user = RegularUser.query.get(user_id)
    is_admin = False

    # Check if user is an admin instead
    if not user:
        admin_user = Admin.query.get(user_id)
        if admin_user:
            user = admin_user
            is_admin = True
        else:
            return "User doesn't exist. Try logging in again.", 404

    # Fetch all achievements
    all_achievements = Achievement.query.all()
    unlocked_ids = set()

    # Determine unlocked achievements
    if is_admin:
        unlocked_ids = {a.id for a in all_achievements}
    else:
        for user_ach in user.user_achievements:
            if user_ach.visited:
                unlocked_ids.add(user_ach.achievement_id)

   
    active_tab = request.args.get('tab', 'unlocked')
    if active_tab == 'unlocked':
        achievements = [a for a in all_achievements if a.id in unlocked_ids]
    elif active_tab == 'locked':
        achievements = [a for a in all_achievements if a.id not in unlocked_ids]
    else:
        achievements = all_achievements

    
    data = [{
        'id': a.id,
        'name': a.name,
        'description': a.description,
        'icon': a.icon,
        'visited': a.id in unlocked_ids
    } for a in achievements]

    return render_template('achievements.html', achievements=data, current_user=user, active_tab=active_tab)

@achievement_views.route('/visit/<int:achievement_id>', methods=['POST'])
@jwt_required()
def toggle_visited(achievement_id):
    user_id = get_jwt_identity()
    user = RegularUser.query.get(user_id)

    if not user:
        return jsonify({"error": "Admins cannot mark achievements visited."}), 403

    achievement = Achievement.query.get(achievement_id)
    if not achievement:
        return jsonify({"error": "Achievement not found."}), 404

    user_ach = UserAchievements.query.filter_by(user_id=user.id, achievement_id=achievement_id).first()

    if not user_ach:
        user_ach = UserAchievements(user_id=user.id, achievement_id=achievement_id, visited=True)
        db.session.add(user_ach)
    else:
        user_ach.visited = not user_ach.visited

    db.session.commit()
    return jsonify(user_ach.get_json()), 200


@achievement_views.route('/api/visited-achievements', methods=['GET'])
@jwt_required()
def get_visited_achievements():
    user_id = get_jwt_identity()
    user = RegularUser.query.get(user_id)

    if not user:
        return jsonify([])

    visited = [
        ach.achievement_id for ach in user.user_achievements if ach.visited
    ]
    return jsonify(visited), 200
