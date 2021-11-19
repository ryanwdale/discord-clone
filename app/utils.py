from db_init import db
from models.account import Account

def get_user_by_id(id):
    return db.session.query(Account).filter(Account.id == id).one()


def get_user_by_username(username):
    return db.session.query(Account).filter(Account.username == username).one()
