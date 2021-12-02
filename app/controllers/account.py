from app_init import db
from controllers.server import server_fields
from models import Account
from flask_restful import Resource, reqparse, fields, marshal_with
from flask_jwt_extended import jwt_required, current_user

parser = reqparse.RequestParser()
parser.add_argument("server_id")


account_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "display_name": fields.String,
    "servers": fields.List(fields.Nested(server_fields)),
}


def get_user_by_id(id):
    return db.session.query(Account).filter(Account.id == id).first()


def get_user_by_username(username):
    return db.session.query(Account).filter(Account.username == username).first()


class AccountResource(Resource):
    @jwt_required()
    @marshal_with(account_fields)
    def get(self):
        return current_user
