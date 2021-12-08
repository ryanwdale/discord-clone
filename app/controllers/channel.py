from app_init import db
from models import Channel
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, fields, marshal_with, abort
from flask_jwt_extended import jwt_required

channel_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "server_id": fields.Integer,
}


def get_channel_by_id(channel_id):
    return db.session.query(Channel).filter(Channel.id == channel_id).first()


class ChannelResource(Resource):
    @jwt_required()
    @marshal_with(channel_fields)
    def get(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if channel is None:
            abort(404, message=f"Channel {channel_id} doesn't exist")
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")
        return channel

    @jwt_required()
    def delete(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if channel is None:
            abort(404, message=f"Channel {channel_id} doesn't exist")
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        db.session.delete(channel)
        db.session.commit()
