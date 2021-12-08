from app_init import db
from sqlalchemy import func
from models import Message, Account
from controllers.channel import get_channel_by_id
from controllers.server_queries import current_user_in_server
from flask_restful import Resource, fields, marshal_with, abort
from flask_jwt_extended import jwt_required

analytics_fields = {
    "user_stats": fields.List(fields.List(fields.String)),
    "wordcount_stats": fields.List(fields.List(fields.String)),
}

def word_stats(channel_id):
    messages = (
        db.session.query(Message.message_content)
        .filter(Message.channel_id == channel_id)
        .all()
    )

    counts = dict()
    for message in messages:
        for word in str(message[0]).split():
            if word in counts:
                counts[word] += 1
            else: 
                counts[word] = 1

    # sort dictionary https://stackoverflow.com/a/2258273
    result = sorted(counts.items(), key=lambda x: x[1], reverse=True)

    return list(result)[: 20]

class AnalyticsResource(Resource):
    @jwt_required()
    @marshal_with(analytics_fields)
    def get(self, channel_id):
        channel = get_channel_by_id(channel_id)
        if not current_user_in_server(channel.server_id):
            abort(403, message="You are not in this server")

        user_stats = (
            db.session.query(Account.display_name, func.count(Message.message_content), Account.username)
            .filter(Message.channel_id == channel_id)
            .join(Account)
            .group_by(Account.username, Account.display_name)
            .all()
        )

        wordcount_stats = word_stats(channel_id)

        res = {
            "user_stats": user_stats,
            "wordcount_stats": wordcount_stats
        }

        return res, 200
