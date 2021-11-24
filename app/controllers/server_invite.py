from app_init import db
from models import ServerInvite

import secrets

from controllers.server_queries import current_user_in_server, get_server_by_id
from flask_restful import abort, fields, marshal_with, Resource
from flask_jwt_extended import current_user, jwt_required


server_invite_fields = {
    "code": fields.String,
    "server_id": fields.Integer,
}


class ServerInviteResource(Resource):
    @jwt_required()
    @marshal_with(server_invite_fields)
    # Endpoint to create server invite
    def post(self, server_id):
        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")

        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")

        invite_code = secrets.token_urlsafe(16)
        server_invite = ServerInvite(server_id, current_user.id, invite_code)

        db.session.add(server_invite)
        db.session.commit()

        return server_invite
