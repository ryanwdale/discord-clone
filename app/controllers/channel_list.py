from app_init import db
from models import Channel
from controllers.channel import channel_fields
from flask_restful import Resource, reqparse, marshal_with

parser = reqparse.RequestParser()
parser.add_argument('channel_name')
parser.add_argument('server_id')


class ChannelListResource(Resource):

    @marshal_with(channel_fields)
    def post(self):
        # add a new channel
        args = parser.parse_args()
        channel = Channel(args['channel_name'], args['server_id'])
        db.session.add(channel)
        db.session.commit()
        return channel, 201
