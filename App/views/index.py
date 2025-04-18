from flask import Blueprint, redirect, render_template, request, send_from_directory, jsonify
from App.controllers import create_user, initialize

import json, os

index_views = Blueprint('index_views', __name__, template_folder='../templates')

#This route is for testing, it can change
@index_views.route('/', methods=['GET'])
def login_page():
    return render_template('login.html')

#This route is for testing, it can change
@index_views.route('/achievements', methods=['GET'])
def achievements_page():
    return render_template('achievements.html')

#This route is for testing, it can change
@index_views.route('/app', methods=['GET'])
def index_page():
    
    #DONT CHANGE THIS BLOCK
    #---------------------------------------------
    base_dir = os.path.abspath(os.path.dirname(__file__))  # path to this file
    manifest_path = os.path.join(base_dir, "..", "static", "frontend", "build", "asset-manifest.json") #path to manifest file

    # Normalize the path
    manifest_path = os.path.normpath(manifest_path)

    with open(manifest_path) as f:
        manifest = json.load(f)

    main_js = manifest["files"]["main.js"]
    main_css = manifest["files"]["main.css"]

    main_js = "../static/frontend/build/"+ main_js
    main_css = "../static/frontend/build/"+ main_css
    #---------------------------------------------

    return render_template("index.html", main_js=main_js, main_css=main_css)

@index_views.route('/init', methods=['GET'])
def init():
    initialize()
    return jsonify(message='db initialized!')

@index_views.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status':'healthy'})