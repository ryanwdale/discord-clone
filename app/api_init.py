from flask_restful import Api
from controllers.login import LoginResource
from controllers.logout import LogoutResource
from controllers.account import AccountResource
from controllers.account_list import AccountListResource
from controllers.account_servers import AccountServersResource
from controllers.server import ServerResource
from controllers.server_invite import ServerInviteResource
from controllers.server_list import ServerListResource
from controllers.channel import ChannelResource
from controllers.message import MessageResource
from controllers.server_channels import ServerChannelsResource


def init_api(app):
    api = Api(app)
    api.add_resource(LoginResource, "/api/login")
    api.add_resource(LogoutResource, "/api/logout")
    api.add_resource(AccountServersResource, "/api/accounts/<int:account_id>/servers")
    api.add_resource(AccountResource, "/api/currentAccount")
    api.add_resource(AccountListResource, "/api/accounts")
    api.add_resource(ServerInviteResource, "/api/servers/<int:server_id>/invites")
    api.add_resource(ServerResource, "/api/servers/<int:server_id>")
    api.add_resource(ServerListResource, "/api/servers")
    api.add_resource(ServerChannelsResource, "/api/servers/<int:server_id>/channels")
    api.add_resource(ChannelResource, "/api/channels/<int:channel_id>")
    api.add_resource(MessageResource, "/api/channels/<int:channel_id>/messages")
