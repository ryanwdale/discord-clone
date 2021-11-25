from app_init import bcrypt
from models import *


def seed_database(db):
    hashed_passwords = [
        bcrypt.generate_password_hash('user1').decode('utf-8'),
        bcrypt.generate_password_hash('user2').decode('utf-8'),
    ]

    accounts = [
        Account('user1', hashed_passwords[0], 'User 1'),
        Account('user2', hashed_passwords[1], 'User 2'),
    ]

    servers = [
        Server('Server 1, with user 1 only'),
    ]

    # IDs are not generated until they have been committed
    db.session.add_all(accounts + servers)
    db.session.commit()

    account_servers = [
        accounts[0].servers.append(servers[0])
    ]

    channels = [
        Channel('Server 1, channel 1', servers[0].id),
        Channel('Server 1, channel 2', servers[0].id),
    ]
    servers[0].channels.append(channels[0])
    servers[0].channels.append(channels[1])

    server_invites = [
        ServerInvite(servers[0].id, accounts[0].id, 'code')
    ]

    db.session.add_all(channels + server_invites)
    db.session.commit()
