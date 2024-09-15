## WebSocket JSON-RPC Server with Nestjs & Socket.io

This application provides a WebSocket-based server using JSON-RPC 2.0 for communication. It allows clients to interact with various services using a structured and standardized protocol.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Environment Variables

The application uses the following environment variables for configuration:

| Environment Variable | Description                                             | Default Value                                           |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `APP_PORT`           | Port on which the application will serve HTTP requests. | `3100`                                                  |
| `WS_PORT`            | Port on which the WebSocket server will be listening.   | `3200`                                                  |
| `MONGODB_URI`        | URI for connecting to the MongoDB database.             | `mongodb://ws-service:ws-service@localhost:27017/items` |

## WebSocket Gateway Methods Examples

Below are the examples for the methods available in the WebSocket gateway using JSON-RPC 2.0. calling request with unique subscribe `itemRequest` you can use socket.io-client.

### 1. `createItem`

Creates a new item in the database.

- **Request**:
  ```json
  {
      "jsonrpc": "2.0",
      "method": "createItem",
      "params": {
          "name": "NewItem",
          "description": "Description of the new item"
          "price": "99.99",
      },
      "id": 1
  }
  ```

### 2. `findAllItems`

Retrieves all items from the database.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "findAllItems",
    "params": {},
    "id": 2
  }
  ```

### 1. `createItem`

Creates a new item in the database.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "createItem",
    "params": {
      "name": "NewItem",
      "description": "Description of the new item"
    },
    "id": 1
  }
  ```
- **Response**:
  ```json
  {
    "jsonrpc": "2.0",
    "result": {
      "id": 1,
      "name": "NewItem",
      "description": "Description of the new item"
    },
    "id": 1
  }
  ```

### 2. `findAllItems`

Retrieves all items from the database.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "findAllItems",
    "params": {},
    "id": 2
  }
  ```
- **Response**:
  ```json
  {
    "jsonrpc": "2.0",
    "result": [
      { "id": 1, "name": "Item 1", "description": "Description of Item 1" },
      { "id": 2, "name": "Item 2", "description": "Description of Item 2" }
    ],
    "id": 2
  }
  ```

### 3. `findOneItem`

Finds a single item by its ID.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "findOneItem",
    "params": { "id": 1 },
    "id": 3
  }
  ```
- **Response**:
  ```json
  {
    "jsonrpc": "2.0",
    "result": {
      "id": 1,
      "name": "Item 1",
      "description": "Description of Item 1"
    },
    "id": 3
  }
  ```

### 4. `updateItem`

Updates an existing item in the database.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "updateItem",
    "params": {
      "id": 1,
      "name": "Updated Item 1",
      "description": "Updated description of Item 1"
    },
    "id": 4
  }
  ```
- **Response**:
  ```json
  {
    "jsonrpc": "2.0",
    "result": {
      "id": 1,
      "name": "Updated Item 1",
      "description": "Updated description of Item 1"
    },
    "id": 4
  }
  ```

### 5. `removeItem`

Deletes an item from the database by its ID.

- **Request**:
  ```json
  {
    "jsonrpc": "2.0",
    "method": "removeItem",
    "params": { "id": 1 },
    "id": 5
  }
  ```
- **Response**:
  ```json
  {
    "jsonrpc": "2.0",
    "result": "Item removed successfully",
    "id": 5
  }
  ```
