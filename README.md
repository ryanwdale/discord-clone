## Getting Started

To (re-)start the services with the latest code:

```sh
docker-compose down
git pull
docker-compose up --build
```

The main app can be viewed at http://localhost:8080

Example API calls:

### create new account

`curl --header "Content-Type: application/json" --request POST --data '{"username":"name","password":"pass"}' http://localhost:8080/api/accounts`

```json
{
  "id": 13,
  "username": "name",
  "password": "pass",
  "servers": []
}
```

### create new server

`curl --header "Content-Type: application/json" --request POST --data '{"server_name": "cool server"}' http://localhost:8080/api/servers`

```json
{
  "id": 1,
  "server_name": "cool server",
  "channels": []
}
```

### create new channel in the server we just created

`curl --header "Content-Type: application/json" --request POST --data '{"channel_name": "cool channel", "server_id": 1}' http://localhost:8080/api/channels`

```json
{
  "id": 2,
  "channel_name": "cool channel",
  "server_id": 1
}
```

### add our account to the server

`curl --header "Content-Type: application/json" --request PUT --data '{"server_id": 1}' http://localhost:8080/api/accounts/13`

```json
{
  "id": 13,
  "username": "name",
  "password": "pass",
  "servers": [
    {
      "id": 1,
      "server_name": "cool server",
      "channels": [
        {
          "id": 2,
          "channel_name": "cool channel",
          "server_id": 1
        }
      ]
    }
  ]
}
```
