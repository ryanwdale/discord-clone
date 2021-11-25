import os
from datetime import datetime, timedelta, timezone

from flask import Flask, request, render_template, session, url_for, g, redirect
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt, set_access_cookies, get_jwt_identity, JWTManager
from sqlalchemy import inspect

from api_init import init_api
from app_init import bcrypt, db
from controllers.account import get_user_by_username, get_user_by_id
from db_init import seed_database


app = Flask(__name__)
app.secret_key = 'somesecretkeythatonlyishouldknow'
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://{}:{}@{}:{}/{}".format(
    os.environ['POSTGRES_USER'],
    os.environ['POSTGRES_PASSWORD'],
    os.environ['POSTGRES_HOST'],
    os.environ['POSTGRES_PORT'],
    os.environ['POSTGRES_DB'],
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = "False"

bcrypt.init_app(app)
db.init_app(app)
CORS(app)

with app.app_context():
    seed_data = False

    inspector = inspect(db.engine)
    current_tables = inspector.get_table_names()

    # Seed with data only if tables do not exist
    if len(current_tables) == 0:
        seed_data = True

    # Create all non-existent tables in case new table has been added to model
    db.create_all()

    if seed_data:
        app.logger.info('Seeding database')
        seed_database(db)

init_api(app)

app.config["JWT_COOKIE_SECURE"] = False  # set this to true for production to allow only https
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # todo: set this to true
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response


# automatic user loading: https://flask-jwt-extended.readthedocs.io/en/stable/automatic_user_loading/
# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return get_user_by_id(identity)



@app.before_request
def before_request():
    g.user = None

    if 'user_id' in session:
        user = get_user_by_id(session['user_id'])
        g.user = user


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session.pop('user_id', None)

        username = request.form['username']
        password = request.form['password']

        user = get_user_by_username(username)
        if bcrypt.check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('profile'))

        return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/profile')
def profile():
    if not g.user:
        return redirect(url_for('login'))

    return render_template('profile.html')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
