from app_init import db
from flask_jwt_extended import current_user
from models import Server, Account
# added this file to prevent circular imports, there's probably a better way


def current_user_in_server(server_id):
    return current_user.id in map(lambda x: x.id, get_users_in_server(server_id))


def get_server_by_id(server_id):
    return db.session.query(Server).filter(Server.id == server_id).first()


def get_users_in_server(server_id):
    return db.session.query(Account).filter(Account.servers.any(Server.id == server_id)).all()
