# blue prints are imported 
# explicitly instead of using *
from .user import user_views
from .index import index_views
from .auth import auth_views
from .admin import setup_admin
from .achievements import achievement_views
from .filter import filters_views
from .marker import marker_views 



views = [user_views, index_views, auth_views, achievement_views, filters_views, marker_views] 
# blueprints must be added to this list

