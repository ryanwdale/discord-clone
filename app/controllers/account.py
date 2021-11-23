from app_init import db
from controllers.server import server_fields
from controllers.server_queries import get_server_by_id, current_user_in_server
from models import Account
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from flask_jwt_extended import jwt_required, current_user

parser = reqparse.RequestParser()
parser.add_argument('server_id')


account_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'password': fields.String,
    'display_name': fields.String,
    'servers': fields.List(fields.Nested(server_fields))
}


def get_user_by_id(id):
    return db.session.query(Account).filter(Account.id == id).first()


def get_user_by_username(username):
    return db.session.query(Account).filter(Account.username == username).first()


class AccountResource(Resource):
    @jwt_required()
    @marshal_with(account_fields)
    def get(self, account_id):
        if current_user.id != account_id:
            abort(403, message="cannot access this user")
        return current_user

    @jwt_required()
    @marshal_with(account_fields)
    def put(self, account_id):
        # add the account to a new server
        args = parser.parse_args()
        server_id = args['server_id']
        # allow anyone in a server to invite people
        if not current_user_in_server(server_id):
            abort(403, message="cannot access this user")
        account = get_user_by_id(account_id)
        server = get_server_by_id(server_id)
        account.servers.append(server)
        db.session.add(account)
        db.session.commit()
        return account
