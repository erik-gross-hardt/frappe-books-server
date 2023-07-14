# Frappe-Books Server

Server implementation for [frappe/books](https://github.com/frappe/books) see using the client from [here](https://github.com/frappe/books/pull/695).

## Deploying the server

> WARNING: **The server has no security checks and the connection between client and server is not encrypted. The server should only be accessible in a secure network, e.g. via VPN. Please be careful.**

There is a [docker-image](https://hub.docker.com/r/erikstacksdocker/frappe-books-server):

```bash
docker run -d -p 8080:81 -e PORT=81 erikstacksdocker/frappe-books-server --name frappe
```

or without docker:

```bash
tsc
yarn start
```

The default port is `3000`.
Books are stored at `/srv/books`, create a volume to persist them.

## Usage

The server works by placing your `*.db` files in the `/books` directory. A restart is required after adding a new book. Multiple books are supported.

On client press the Existing Company Server button and enter the server adress like this example:

```
http://localhost:3000/demo.db
```

hit connect.
