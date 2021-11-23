from app_init import bcrypt, db
from models import Account
from controllers.account import account_fields, get_user_by_username
from flask_restful import Resource, reqparse, marshal, abort
from flask_jwt_extended import create_access_token, set_access_cookies
from flask import jsonify

parser = reqparse.RequestParser()
parser.add_argument('username')
parser.add_argument('password')
parser.add_argument('display_name')


class AccountListResource(Resource):

    def post(self):
        # add a new account
        args = parser.parse_args()
        # check if account already exist
        if get_user_by_username(args['username']):
            return abort(422, message="username has been taken")
        hashed_password = bcrypt.generate_password_hash(args['password']).decode('utf-8')
        account = Account(args['username'], hashed_password, args['display_name'])
        db.session.add(account)
        db.session.commit()
        access_token = create_access_token(identity=account)
        user_dict = marshal(account, account_fields)
        user_response = jsonify(user_dict)
        set_access_cookies(user_response, access_token)
        user_response.status_code = 201
        return user_response

