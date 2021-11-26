from app_init import db
from models import Message, Account
from flask_restful import Resource, reqparse, fields, marshal_with
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

        message = Message(args["channel_id"], user_id, args["message_content"])
        db.session.add(message)
        db.session.commit()

        return None, 201

    @jwt_required()
    @marshal_with(message_fields)
    def get(self):
        args = fetch_parser.parse_args()
        messages = db.session.query(Message, Account.display_name).filter(Message.channel_id == args["channel_id"]).join(Account.id == Message.user_id).order_by(Message.id.desc()).limit(100)
        messages = messages[::-1]

        return messages, 200
