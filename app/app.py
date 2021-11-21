import os

from flask import Flask, request, render_template, session, url_for, g, redirect
from flask_bcrypt import Bcrypt

from db_init import db
from controllers.account import get_user_by_username, get_user_by_id

from api_init import init_api

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
bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()

init_api(app)


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
