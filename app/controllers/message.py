from app_init import db
from models import Message, Account
from controllers.channel import get_channel_by_id
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from flask_jwt_extended import jwt_required, current_user

parser = reqparse.RequestParser()
parser.add_argument('channel_id')
parser.add_argument('message_content')

message_fields = {
    'id': fields.Integer,
    'display_name': fields.String,
    'timestamp': fields.DateTime,
    'channel_id': fields.Integer,
    'message_content': fields.String
}

fetch_parser = reqparse.RequestParser()
fetch_parser.add_argument('channel_id')

class MessageResource(Resource):
    @jwt_required()
    def post(self):
        args = parser.parse_args()
        user_id = current_user.id

        channel = get_channel_by_id(args["channel_id"])
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        message = Message(args["channel_id"], user_id, args["message_content"])
        db.session.add(message)
        db.session.commit()

        return None, 201

    @jwt_required()
    @marshal_with(message_fields)
    def get(self):
        args = fetch_parser.parse_args()

        channel = get_channel_by_id(args["channel_id"])
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        messages = db.session.query(Message).filter(Message.channel_id == args["channel_id"]).join(Account).order_by(Message.id.desc()).limit(100).with_entities(Message, Account).all()
        messages = messages[::-1]
        result = [message[1].__dict__ | message[0].__dict__ for message in messages]

        return result, 200
