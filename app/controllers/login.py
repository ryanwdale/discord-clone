from app_init import bcrypt
from controllers.account import get_user_by_username, account_fields
from flask_restful import abort, Resource, reqparse, marshal
from flask_jwt_extended import create_access_token, set_access_cookies
from flask import jsonify

parser = reqparse.RequestParser()
parser.add_argument("username")
parser.add_argument("password")


class LoginResource(Resource):
    def post(self):
        args = parser.parse_args()
        username = args["username"]
        password = args["password"]

        user = get_user_by_username(username)

        if user is None:
            return abort(404, message="user does not exist")

        if bcrypt.check_password_hash(user.password, password):
            user_dict = marshal(user, account_fields)
            user_response = jsonify(user_dict)
            access_token = create_access_token(identity=user)
            set_access_cookies(user_response, access_token)
            return user_response

        return abort(403, message="could not log in")
