from app_init import db


class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_name = db.Column(db.String, nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('server.id'),
                          nullable=False)

    def __init__(self, channel_name, server_id):
        self.channel_name = channel_name
        self.server_id = server_id
