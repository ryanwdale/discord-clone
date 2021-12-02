from app_init import db
from models import Server
from controllers.server import server_fields
from flask_restful import Resource, reqparse, marshal_with
from flask_jwt_extended import jwt_required, current_user


parser = reqparse.RequestParser()
parser.add_argument("server_name")


class ServerListResource(Resource):
    @jwt_required()
    @marshal_with(server_fields)
    def post(self):
        args = parser.parse_args()
        # create the server
        server = Server(args["server_name"])
        db.session.add(server)
        db.session.commit()
        # add current user to server
        current_user.servers.append(server)
        db.session.add(current_user)
        db.session.commit()
        return server, 201
