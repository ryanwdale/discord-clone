from app_init import db


class Server(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    server_name = db.Column(db.String, nullable=False)
    channels = db.relationship(
        "Channel", lazy="select", backref=db.backref("server", lazy="joined")
    )

    def __init__(self, server_name):
        self.server_name = server_name
