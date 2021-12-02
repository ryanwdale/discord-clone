from app_init import db
from sqlalchemy import func


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channel.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    message_content = db.Column(db.String, nullable=False)

    def __init__(self, channel_id, user_id, message_content):
        self.channel_id = channel_id
        self.user_id = user_id
        self.message_content = message_content
