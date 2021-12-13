from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

bcrypt = Bcrypt()
db = SQLAlchemy()
socket = SocketIO()
