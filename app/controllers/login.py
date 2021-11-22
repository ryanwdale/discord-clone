from app_init import bcrypt, db
from controllers.server import ServerResource, server_fields
from controllers.account import get_user_by_username, account_fields
from models import Account
from flask import session
from flask_restful import abort, Resource, reqparse, fields, marshal_with

parser = reqparse.RequestParser()
parser.add_argument("username")
parser.add_argument("password")


class LoginResource(Resource):
    @marshal_with(account_fields)
    def post(self):
        args = parser.parse_args()
        username = args["username"]
        password = args["password"]

        user = get_user_by_username(username)

        if user is None:
            return abort(404, message="user does not exist")

        if bcrypt.check_password_hash(user.password, password):
            session["user_id"] = user.id
            return user

        return abort(403, message="could not log in")
