from app_init import db

account_to_server = db.Table('account_to_server',
                             db.Column('account_id', db.Integer, db.ForeignKey(
                                 'account.id'), primary_key=True),
                             db.Column('server_id', db.Integer, db.ForeignKey(
                                 'server.id'), primary_key=True)
                             )


class Account(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    display_name = db.Column(db.String, nullable=False)
    servers = db.relationship('Server', secondary=account_to_server, lazy='subquery',
                              backref=db.backref('accounts', lazy=True))

    def __init__(self, username, password, display_name):
        self.username = username
        self.password = password
        self.display_name = display_name
