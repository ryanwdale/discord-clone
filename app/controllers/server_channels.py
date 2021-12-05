from app_init import db
from controllers.channel import channel_fields
from controllers.server_queries import current_user_in_server, get_channels_in_server
from flask_restful import Resource, marshal_with, abort, reqparse
from flask_jwt_extended import jwt_required
from models import Channel

parser = reqparse.RequestParser()
parser.add_argument("channel_name")


class ServerChannelsResource(Resource):
    @jwt_required()
    @marshal_with(channel_fields)
    def get(self, server_id):
        # get all channels in server
        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")
        return get_channels_in_server(server_id)

    @jwt_required()
    @marshal_with(channel_fields)
    def post(self, server_id):
        # add a new channel
        args = parser.parse_args()
        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")
        channel = Channel(args["channel_name"], server_id)
        db.session.add(channel)
        db.session.commit()
        return channel, 201
