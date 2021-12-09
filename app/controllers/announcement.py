from app_init import db
from models import Message, Account, Annoucnement
from controllers.channel import get_channel_by_id
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from flask_jwt_extended import jwt_required, current_user
from flask_socketio import SocketIO

parser = reqparse.RequestParser()
parser.add_argument('announcement')

message_fields = {
    'id': fields.Integer,
    'display_name': fields.String,
    'timestamp': fields.DateTime,
    'channel_id': fields.Integer,
    'announcement': fields.String
}

class AnnouncementResource(Resource):
    @jwt_required()
    def post(self, channel_id):
        args = parser.parse_args()
        user_id = current_user.id

        channel = get_channel_by_id(channel_id)
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        announcement = Announcement(channel_id, user_id, args["announcement"])
        db.session.add(announcement)
        db.session.commit()

        return None, 201

    @jwt_required()
    @marshal_with(announcement)
    def get(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        announcement = db.session.query(Announcement).filter(Message.channel_id == channel_id).order_by(Announcement.id.desc()).limit(100).all()
        result = [message[1].__dict__ | message[0].__dict__ for message in messages]

        return result, 200
