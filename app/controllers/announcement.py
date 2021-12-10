from app_init import db
from models import Message, Account, Announcement
from controllers.channel import get_channel_by_id
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from flask_jwt_extended import jwt_required, current_user
from flask_socketio import SocketIO

parser = reqparse.RequestParser()
parser.add_argument('announcement')

announcement_fields = {
    'id': fields.Integer,
    'display_name': fields.String,
    'timestamp': fields.DateTime,
    'channel_id': fields.Integer,
    'announcement': fields.String
}

class AnnouncementResource(Resource):
    @jwt_required()
    @marshal_with(announcement_fields)
    def post(self, channel_id):
        args = parser.parse_args()
        user_id = current_user.id

        channel = get_channel_by_id(channel_id)
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        announcement = Announcement(channel_id, user_id, args["announcement"])
        db.session.add(announcement)
        db.session.commit()

        return announcement, 201

    @jwt_required()
    @marshal_with(announcement_fields)
    def get(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        announcements = (
            db.session.query(Announcement)
            .filter(Announcement.channel_id == channel_id)
            .join(Account)
            .all()
        )
        return announcements, 200
 