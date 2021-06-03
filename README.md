# Mocky REST API

This is a simple REST API mock server for testing/sampling frontend applications.

### System Requirements:
- NodeJS

### Setup

1. `npm install`
1. `npm start`

### Authentication

`POST /api/v1/auth`
```json
{
    "email": "johnd@example.com",
    "password": "asdf123!"
}
```

Once authenticated, use Authorization header to include provided token.

### Endpoints

#### Items
- `GET /api/v1/items`
- `GET /api/v1/items/:id`
- `POST /api/v1/items`
- `PUT /api/v1/items/:id`
- `DELETE /api/v1/items/:id`

```json
{
    "title": "yolo",
    "text": "text here",
    "date": "2020-12-12"
}
```

#### Users (admin access only)
- `GET /api/v1/users`
- `GET /api/v1/users/:id`

```json
{
    "email": "johnd@example.com",
    "password": "asdf123!",
    "role": "admin"
}
```
```json
{
    "email": "janed@example.com",
    "password": "qwer1234!",
    "role": "user"
}
```
