from flask import Blueprint, render_template, jsonify, request, flash, send_from_directory, flash, redirect, url_for
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies
from App.controllers import get_user_by_username,create_user,get_all_users

from .index import index_views

from App.controllers import (login)

auth_views = Blueprint('auth_views', __name__, template_folder='../templates')
'''
Page/Action Routes
'''


@auth_views.route('/register', methods=['GET', 'POST'])
def user_page():

    if request.method == 'POST':
        data = request.form
        if not data['username'] or not data['password']:
            flash('Missing required fields')
            return redirect(url_for('index_views.index_page')), 400

        user = get_user_by_username(data['username'])
        if user:
            flash('Username already exists')
            return jsonify({'success': False, 'message': 'User Already exists'}), 422

        user = create_user(data['username'], data['password'])
        if user:
            token = login(data['username'], data['password'])
            response_data = {
                'success': True,
                'message': 'Registration successful',
                'user': user.username
            }

            response = jsonify(response_data)
            set_access_cookies(response, token)
            return response
        return redirect(url_for('index_views.index_page')), 400

    users = get_all_users()
    return render_template('users.html', users=users)



@auth_views.route('/login', methods=['POST'])
def login_action():
    data = request.form
    token = login(data['username'], data['password'])

    if not token:
        return jsonify({'success': False, 'message': 'Bad username or password'}), 401

    user = get_user_by_username(data['username'])

    response_data = {
        'success': True,
        'message': 'Login successful',
        'user': user.username
    }

    response = jsonify(response_data)
    set_access_cookies(response, token)
    return response

@auth_views.route('/logout', methods=['GET'])
@jwt_required()
def logout_action():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response


'''
API Routes
'''


@auth_views.route('/api/login', methods=['POST'])
def user_login_api():
    data = request.json
    token = login(data['username'], data['password'])
    if not token:
        return jsonify(message='bad username or password given'), 401
    response = jsonify(access_token=token)
    set_access_cookies(response, token)
    return response


@auth_views.route('/api/identify', methods=['GET'])
@jwt_required()
def identify_user():
    return jsonify({
        'message':
        f"username: {current_user.username}, id : {current_user.id}"
    })


@auth_views.route('/api/logout', methods=['GET'])
def logout_api():
    response = jsonify(message="Logged Out!")
    unset_jwt_cookies(response)
    return response
