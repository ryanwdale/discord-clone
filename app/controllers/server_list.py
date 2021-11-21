from db_init import db
from models import Server
from controllers.server import server_fields
from flask_restful import Resource, reqparse, marshal_with


parser = reqparse.RequestParser()
parser.add_argument('server_name')


class ServerListResource(Resource):

    @marshal_with(server_fields)
    def post(self):
        args = parser.parse_args()
        server = Server(args['server_name'])
        db.session.add(server)
        db.session.commit()
        return server, 201
