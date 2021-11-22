from app_init import bcrypt, db
from models import Account
from controllers.account import account_fields
from flask_restful import Resource, reqparse, marshal_with

parser = reqparse.RequestParser()
parser.add_argument('username')
parser.add_argument('password')


class AccountListResource(Resource):

    @marshal_with(account_fields)
    def post(self):
        # add a new account
        args = parser.parse_args()
        hashed_password = bcrypt.generate_password_hash(args['password']).decode('utf-8')
        account = Account(args['username'], hashed_password)
        db.session.add(account)
        db.session.commit()
        return account, 201
