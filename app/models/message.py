from app_init import db

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String, nullable=False)
    message_content = db.Column(db.String, nullable=False)

    def __init__(self, channel_id, username, message_content):
        self.channel_id = channel_id
        self.username = username
        self.message_content = message_content
