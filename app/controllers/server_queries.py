from app_init import db
from models import Account, Server, ServerInvite
from models import Channel

# added this file to prevent circular imports, there's probably a better way

from datetime import datetime
from flask_jwt_extended import current_user


def current_user_in_server(server_id, user_id=None):
    if user_id is None:
        user_id = current_user.id

    return user_id in map(lambda x: x.id, get_users_in_server(server_id))


def get_server_by_id(server_id):
    return db.session.query(Server).filter(Server.id == server_id).first()


def get_users_in_server(server_id):
    return (
        db.session.query(Account)
        .filter(Account.servers.any(Server.id == server_id))
        .all()
    )


def is_valid_server_invite(server_id, code):
    current_time = datetime.utcnow()

    return (
        db.session.query(ServerInvite)
        .filter(
            ServerInvite.server_id == server_id,
            ServerInvite.code == code,
            current_time < ServerInvite.expiration,
        )
        .first()
        is not None
    )


def get_channels_in_server(server_id):
    return db.session.query(Channel).filter(Channel.server_id == server_id).all()


def get_channel_by_id(channel_id):
    return db.session.query(Channel).filter(Channel.id == channel_id).first()
