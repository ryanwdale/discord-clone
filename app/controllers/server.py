from db_init import db
from models import Server
from controllers.channel import ChannelResource, channel_fields
from flask_restful import Resource, fields, marshal_with, abort, reqparse

parser = reqparse.RequestParser()
parser.add_argument('channel_id')

server_fields = {
    'id': fields.Integer,
    'server_name': fields.String,
    'channels': fields.List(fields.Nested(channel_fields))
}


class ServerResource(Resource):

    @marshal_with(server_fields)
    def get(self, server_id):
        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")
        return server

    @marshal_with(server_fields)
    def put(self, server_id):
        # add a new channel to the server
        args = parser.parse_args()
        channel_id = args['channel_id']
        channel = ChannelResource.get_channel_by_id(channel_id)
        if channel is None:
            abort(404, message=f"Channel {channel_id} doesn't exist")
        server = get_server_by_id(server_id)
        if server is None:
            abort(404, message=f"Server {server_id} doesn't exist")
        server.channels.append(channel)
        db.session.add(server)
        db.session.commit()
        return server

    @staticmethod
    def get_server_by_id(id):
        return db.session.query(Server).filter(Server.id == id).first()
