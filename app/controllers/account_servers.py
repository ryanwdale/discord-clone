from app_init import db
from controllers.server import server_fields
from controllers.server_queries import (
    current_user_in_server,
    get_server_by_id,
    is_valid_server_invite,
)

from flask_jwt_extended import current_user, jwt_required
from flask_restful import abort, marshal_with, reqparse, Resource

parser = reqparse.RequestParser()
parser.add_argument("server_id")
parser.add_argument("code")


class AccountServersResource(Resource):
    @jwt_required()
    @marshal_with(server_fields)
    def put(self, account_id):
        args = parser.parse_args()
        server_id = args["server_id"]

        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")

        if current_user.id != account_id:
            abort(403, message="You must use an invite code on yourself")

        if current_user_in_server(server_id):
            abort(422, message="You are already in this server")

        code = args["code"]

        if not is_valid_server_invite(server_id, code):
            abort(403, message="Invalid server invite")

        current_user.servers.append(server)
        db.session.add(current_user)
        db.session.commit()

        return current_user.servers
