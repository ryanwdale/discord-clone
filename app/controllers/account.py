from app_init import db
from controllers.server import ServerResource, server_fields
from models import Account
from flask_restful import Resource, reqparse, fields, marshal_with

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
    @marshal_with(account_fields)
    def get(self, account_id):
        return get_user_by_id(account_id)

    @marshal_with(account_fields)
    def put(self, account_id):
        # add the account to a new server
        args = parser.parse_args()
        account = get_user_by_id(account_id)
        server = ServerResource.get_server_by_id(args['server_id'])
        account.servers.append(server)
        db.session.add(account)
        db.session.commit()
        return account
