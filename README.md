# Wallet API

## Overview

This repository provides a robust and well-structured API for managing wallets and payments. It offers functionalities for creating, managing, and retrieving wallet information, as well as processing payments. The API utilizes Express.js for server-side routing and integrates seamlessly with a MongoDB database for data persistence.

## Key Features:

**Wallet Management**
- Create and manage user wallets.
- View and update wallet balances.


**Payment Processing**
- Process various types of payments (e.g., credit, debit).
- Validate payment details for security.

## Installation

Clone the repository:

```
git clone https://github.com/hanswarde/wallet-api.git
```

Install dependencies:
```
cd wallet-api
npm install
```

## Configuration

1. Create a .env file in the project root directory.

2. Add the following environment variables (replace placeholders with actual values):
```
MONGODB_URI=mongodb://your_mongo_host:port/your_database_name
PORT=3000  # Optional: Port for the server to listen on (default: 3000)
```

## Running the API

Start the development server:

```
npm start
```

This will start the API and listen for requests on the specified port (default: 3000).

## API Endpoints

1. Ping Endpoint
```
GET /ping
```
- Returns a simple "pong" response to verify API uptime.
2. Payment API
```
POST /api/v1/payment
```
- Processes payments transactions.
```
GET /api/v1/payment/:userId
```
- Retrieves a user's transactions

3. Wallet API
```
GET /api/v1/wallet/:userId
```
- Retrieves a user's wallet information.

## Testing

The project includes unit tests for core functionalities. To run tests:

```
npm test
```
