# CRUD API - User Management

A simple Node.js REST API for managing users with MongoDB.

## Features

- Create users (POST)
- Read all users (GET)
- Read a specific user (GET)
- Update users (PUT)
- Delete users (DELETE)
- Comprehensive error and success messages
- Input validation
- MongoDB connection management

## User Model

- **name** (required) - String
- **email** (required, unique) - String with email validation
- **phone** (optional) - String
- **address** (optional) - String
- Timestamps included automatically

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure .env file:**
   - Open `.env` file
   - Add your MongoDB cluster URI: `mongodb+srv://username:password@cluster-name.mongodb.net/`
   - Set the database name (e.g., `user_management`)
   - Optionally change the PORT (default: 5000)

3. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User Created Successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "createdAt": "2024-06-02T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation Error",
  "error": "Name and email are required fields"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Email Already Exists",
  "error": "The email address john@example.com is already registered in the system"
}
```

### Get All Users
```
GET /api/users
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users Retrieved Successfully",
  "count": 2,
  "data": [
    {
      "_id": "607f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "address": "123 Main St",
      "createdAt": "2024-06-02T10:30:00.000Z"
    }
  ]
}
```

### Get User by ID
```
GET /api/users/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Retrieved Successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User Not Found",
  "error": "No user found with ID: 607f1f77bcf86cd799439011"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid User ID",
  "error": "The provided user ID is not valid"
}
```

### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Updated Successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main St",
    "updatedAt": "2024-06-02T11:00:00.000Z"
  }
}
```

### Delete User
```
DELETE /api/users/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User Deleted Successfully",
  "data": {
    "_id": "607f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "deletedAt": "2024-06-02T12:00:00.000Z"
  }
}
```

## Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Clear success message",
  "data": { /* Response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error type/category",
  "error": "Detailed error description",
  "timestamp": "ISO timestamp" // For errors only
}
```

## Error Handling

- **400 Bad Request** - Validation errors, invalid input
- **404 Not Found** - User or route not found
- **409 Conflict** - Email already exists
- **500 Internal Server Error** - Server-side issues

## Example .env Configuration

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/
DB_NAME=user_management
```

## Project Structure

```
crud-api/
├── models/
│   └── User.js              # User schema with validations
├── controllers/
│   └── userController.js    # CRUD business logic with error handling
├── routes/
│   └── userRoutes.js        # API routes
├── server.js                # Main server file
├── .env                     # Environment variables (create your own)
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
└── README.md                # Documentation
```

## Installation & Running

```bash
# Install dependencies
npm install

# Run the server
npm start

# Run with auto-reload (requires nodemon)
npm run dev
```

The API will be available at `http://localhost:5000`
