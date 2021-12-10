from app_init import db
from sqlalchemy import func

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channel.id"), nullable=False)
    author_user_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    message = db.Column(db.String, nullable=False)
    accounts = db.relationship(
        "Account",
        cascade="all,delete",
        backref=db.backref("announcements", lazy=True)
    )

    def __init__(self, channel_id, author_user_id, message):
        self.channel_id = channel_id
        self.author_user_id = author_user_id
        self.message = message

