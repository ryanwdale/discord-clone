from app_init import db
from controllers.server_queries import current_user_in_server, get_server_by_id
from controllers.channel import get_channel_by_id, channel_fields
from flask_restful import Resource, fields, marshal_with, abort, reqparse
from flask_jwt_extended import jwt_required


parser = reqparse.RequestParser()
parser.add_argument("channel_id")

server_fields = {
    "id": fields.Integer,
    "server_name": fields.String,
    "channels": fields.List(fields.Nested(channel_fields)),
}


class ServerResource(Resource):
    @jwt_required()
    @marshal_with(server_fields)
    def get(self, server_id):
        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")
        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")
        return server

    @jwt_required()
    @marshal_with(server_fields)
    def put(self, server_id):
        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")
        # add a new channel to the server
        args = parser.parse_args()
        channel_id = args["channel_id"]
        channel = get_channel_by_id(channel_id)
        if channel is None:
            abort(404, message=f"Channel {channel_id} doesn't exist")
        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")
        server.channels.append(channel)
        db.session.add(server)
        db.session.commit()
        return server
