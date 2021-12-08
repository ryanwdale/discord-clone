from app_init import db


class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("server.id"), nullable=False)
    messages = db.relationship(
        "Message",
        cascade="all,delete",
        backref=db.backref("channels", lazy=True),
    )

    def __init__(self, channel_name, server_id):
        self.name = channel_name
        self.server_id = server_id
