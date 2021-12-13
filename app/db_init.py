from app_init import bcrypt
from models import *


def seed_database(db):
    hashed_passwords = [
        bcrypt.generate_password_hash("user1").decode("utf-8"),
        bcrypt.generate_password_hash("user2").decode("utf-8"),
        bcrypt.generate_password_hash("user3").decode("utf-8"),
    ]

    accounts = [
        Account("user1", hashed_passwords[0], "User 1"),
        Account("user2", hashed_passwords[1], "User 2"),
        Account("user3", hashed_passwords[2], "User 3"),
    ]

    servers = [
        Server("Server 1, with users 1 and 2"),
    ]

    # IDs are not generated until they have been committed
    db.session.add_all(accounts + servers)
    db.session.commit()

    account_servers = [
        accounts[0].servers.append(servers[0]),
        accounts[1].servers.append(servers[0]),
    ]

    channels = [
        Channel("Server 1, channel 1", servers[0].id),
        Channel("Server 1, channel 2", servers[0].id),
    ]
    servers[0].channels.append(channels[0])
    servers[0].channels.append(channels[1])

    server_invites = [ServerInvite(servers[0].id, accounts[0].id, "code")]

    db.session.add_all(channels + server_invites)
    db.session.commit()

    messages = [
        Message(
            channels[0].id,
            accounts[0].id,
            "Welcome to the CMPT 470 project website for group 1",
        ),
        Message(channels[0].id, accounts[1].id, "I'm not in group 1. I'm in group 14."),
        Message(
            channels[0].id,
            accounts[0].id,
            "Then you're in the wrong chat room. I've removed you from this server",
        ),
        Message(
            channels[1].id, accounts[0].id, "This channel is for off-topic discussion"
        ),
        Message(
            channels[1].id,
            accounts[0].id,
            "Text formatting has been implemented: _italics_, **bold**, `inline code`, ***italic + bold***",
        ),
        Message(
            channels[1].id,
            accounts[0].id,
            "Source for above example: ``_italics_, **bold**, `inline code`, ***italic + bold***``",
        ),
    ]

    announcements = [
        Announcement(
            channels[0].id,
            accounts[0].id,
            "This is an announcement",
        ),
        Announcement(
            channels[1].id,
            accounts[1].id,
            "Hello",
        ),
    ]

    db.session.add_all(messages + announcements)
    db.session.commit()
