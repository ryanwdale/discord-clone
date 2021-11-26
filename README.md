# Getting Started

To (re-)start the services with the latest code:

```sh
docker-compose down -v
git pull
docker-compose up --build
```

The main app can be viewed at http://localhost:8080

You may log in with the following pre-seeded account:
- username: `user1`
- password: `user1`


# Main features

- Dockerized deployment
- REST API served by Flask
- Ajax-based chats in channels
- bcrypt-hashed passwords stored in Postgres database
- usage of SQLAlchemy ORM
- authentication with JWTs
- invite link generation for chat servers
- channels in servers (many-to-one)
