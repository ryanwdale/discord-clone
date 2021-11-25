from app_init import db
from models import Message
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from flask_jwt_extended import jwt_required, current_user

parser = reqparse.RequestParser()

message_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'channel_id': fields.Integer,
    'message_content': fields.String
}

class MessageResource(Resource):
    @jwt_required()
    @marshal_with(message_fields)
    def post(self):
        args = parser.parse_args()

        print(args.__dict__)

        # message = Message(args["channel_id"], args["username"], args["message_content"])
        # db.session.add(message)
        # db.session.commit()

        # return None, 201