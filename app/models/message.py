from app_init import db
from sqlalchemy import DDL, event, func, Index
from sqlalchemy.types import UserDefinedType


# Based on http://nibrahim.net.in/2013/11/29/sqlalchemy_and_full_text_searching_in_postgresql.html
class TsVector(UserDefinedType):
    def get_col_spec(self):
        return "TSVECTOR"

    class comparator_factory(UserDefinedType.Comparator):
        def __eq__(self, other):
            return self.op("@@")(func.plainto_tsquery(other))


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey("channel.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=func.now())
    message_content = db.Column(db.String, nullable=False)
    message_content_tsvector = db.Column(TsVector)

    __table_args__ = (
        Index(
            "message_content_tsvector_idx",
            "message_content_tsvector",
            postgresql_using="gin",
        ),
    )

    def __init__(self, channel_id, user_id, message_content):
        self.channel_id = channel_id
        self.user_id = user_id
        self.message_content = message_content


trigger_snippet = DDL(
    """
CREATE TRIGGER message_content_tsvector_update BEFORE INSERT OR UPDATE
ON Message
FOR EACH ROW EXECUTE PROCEDURE
tsvector_update_trigger(message_content_tsvector, 'pg_catalog.english', 'message_content')
"""
)

event.listen(
    Message.__table__, "after_create", trigger_snippet.execute_if(dialect="postgresql")
)
