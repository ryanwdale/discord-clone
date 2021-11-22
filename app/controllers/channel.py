from app_init import db
from models import Channel
from flask_restful import Resource, reqparse, fields, marshal_with, abort

parser = reqparse.RequestParser()
parser.add_argument('server_id')

channel_fields = {
    'id': fields.Integer,
    'channel_name': fields.String,
    'server_id': fields.Integer
}


class ChannelResource(Resource):
    @marshal_with(channel_fields)
    def get(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if channel is None:
            abort(404, message=f"Channel {channel_id} doesn't exist")
        return channel

    @staticmethod
    def get_channel_by_id(id):
        return db.session.query(Channel).filter(Channel.id == id).first()
