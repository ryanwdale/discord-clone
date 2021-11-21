from flask_restful import Api
from controllers.account import AccountResource
from controllers.account_list import AccountListResource
from controllers.server import ServerResource
from controllers.server_list import ServerListResource
from controllers.channel import ChannelResource
from controllers.channel_list import ChannelListResource


def init_api(app):
    api = Api(app)
    api.add_resource(AccountResource, '/accounts/<int:account_id>')
    api.add_resource(AccountListResource, '/accounts')
    api.add_resource(ServerResource, '/servers/<int:server_id>')
    api.add_resource(ServerListResource, '/servers')
    api.add_resource(ChannelResource, '/channels/<int:channel_id>')
    api.add_resource(ChannelListResource, '/channels')
