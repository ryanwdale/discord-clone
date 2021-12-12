from app_init import db
from sqlalchemy import func

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channel.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    announcement = db.Column(db.String, nullable=False)
    accounts = db.relationship(
        "Account",
        cascade="all,delete",
        backref=db.backref("announcements")

    )

    def __init__(self, channel_id, user_id, announcement):
        self.channel_id = channel_id
        self.user_id = user_id
        self.announcement = announcement
