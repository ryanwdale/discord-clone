from app_init import db

from sqlalchemy.sql.expression import text


class ServerInvite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey("server.id"), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    code = db.Column(db.String(32), unique=True, index=True, nullable=False)

    # From https://stackoverflow.com/a/33532154 (server_default)
    # and from https://stackoverflow.com/a/30496633 (INTERVAL for Postgres)
    grace_period = text("NOW() + INTERVAL '7 DAYS'")
    expiration = db.Column(db.DateTime, server_default=grace_period)

    def __init__(self, server_id, creator_id, code):
        self.server_id = server_id
        self.creator_id = creator_id
        self.code = code
