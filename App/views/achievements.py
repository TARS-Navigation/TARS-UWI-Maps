

from flask import Blueprint, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from App.models.regular_user import RegularUser
from App.models.achievement import Achievement

achievement_views = Blueprint('achievements_views', __name__, template_folder = '../templates')

@achievement_views.route('/achievements')
@jwt_required()
def achievements_page():
    user_id = get_jwt_identity()
    user = RegularUser.query.get(user_id)

    allAchievements = Achievement.query.all()
    userAchievements = []
    for ua in user.user_achievements:
        if ua.visited:
           userAchievements.append(ua.achievement_id) 
            

    data = []
    for achievement in allAchievements:
        data.append({
            'name': achievement.name,
            'description': achievement.description,
            'icon': achievement.icon,
            'visited': achievement.id in userAchievements

            })

    return render_template('achievements.html', allAchievements = data)

