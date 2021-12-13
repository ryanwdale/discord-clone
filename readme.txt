Getting Started
	To (re-)start the services with the latest code:
		docker-compose down -v
		git pull
		docker-compose up --build

	The main app can be viewed at http://localhost:8080

	You may log in with the following pre-seeded account:
		- username: user1
		- password: user1

	To simulate a multi-user session, you may use a second pre-seeded account
	that is in the same server as "user1":
		- username: user2
		- password: user2


Main features
	- Dockerized deployment with production-ready server and database
	- REST API served by Flask
	- WebSocket-based chats in channels
	- bcrypt-hashed passwords stored in Postgres database
	- CSRF protection
	- usage of SQLAlchemy ORM
	- authentication with JWTs
	- search channel messages via "tsvector"s and "tsquery"s
	- invite link generation for chat servers
	- channel analytics (message counts by user and top words in channel)
	- channels in servers (many-to-one)
	- markdown support for chat messages
