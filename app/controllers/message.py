from app_init import db
from models import Message
from flask_restful import Resource, reqparse, fields, marshal_with
from flask_jwt_extended import jwt_required, current_user

parser = reqparse.RequestParser()
parser.add_argument('channel_id')
parser.add_argument('username')
parser.add_argument('message_content')

message_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'channel_id': fields.Integer,
    'message_content': fields.String
}

fetch_parser = reqparse.RequestParser()
fetch_parser.add_argument('channel_id')

message_fetch_fields = {
    'id': fields.Integer,
    'channel_id': fields.Integer,
}

class MessageResource(Resource):
    @jwt_required()
    @marshal_with(message_fields)
    def post(self):
        args = parser.parse_args()

        message = Message(args["channel_id"], args["username"], args["message_content"])
        db.session.add(message)
        db.session.commit()

        return None, 201

    @jwt_required()
    @marshal_with(message_fetch_fields)
    def get(self):
        args = fetch_parser.parse_args()
        messages = db.session.query(Message).filter(Message.channel_id == args["channel_id"]).all()
        print(messages)

        return messages, 201
