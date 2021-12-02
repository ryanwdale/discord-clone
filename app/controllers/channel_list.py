from app_init import db
from models import Channel
from controllers.channel import channel_fields
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, reqparse, marshal_with, abort
from flask_jwt_extended import jwt_required

parser = reqparse.RequestParser()
parser.add_argument("channel_name")
parser.add_argument("server_id")


class ChannelListResource(Resource):
    @jwt_required()
    @marshal_with(channel_fields)
    def post(self):
        # add a new channel
        args = parser.parse_args()
        server_id = args["server_id"]
        if not current_user_in_server(server_id):
            abort(403, message="You are not in this server")
        channel = Channel(args["channel_name"], server_id)
        db.session.add(channel)
        db.session.commit()
        return channel, 201
