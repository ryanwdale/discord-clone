import os

from flask import Flask, request, render_template, session, url_for, g, redirect
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

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
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)


def get_user_by_id(id):
    return db.session.query(Account).filter(Account.id == id).one()


def get_user_by_username(username):
    return db.session.query(Account).filter(Account.username == username).one()


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
