# Mini URL Shortener API

A simple REST API to shorten long URLs and redirect short codes to the original URLs. Built with Node.js, Express, and MongoDB.

## Features
- Shorten long URLs to short codes
- Redirect short codes to original URLs
- URL validation and error handling
- Tracks number of clicks (analytics)
- (Optional) Expiry date for short URLs

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/urlshortener
   PORT=3000
   BASE_URL=http://localhost:3000
   ```
4. Start MongoDB locally (if not using Atlas).
5. Run the server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

## Docker Installation

### Prerequisites
- Docker
- Docker Compose

### Using Docker
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd assignment
   ```
2. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build the Node.js application
   - Start MongoDB container
   - Start the API server on `http://localhost:3000`
3. To run in detached mode:
   ```bash
   docker-compose up -d
   ```
4. To stop the containers:
   ```bash
   docker-compose down
   ```

### Using Docker (without Docker Compose)
1. Build the Docker image:
   ```bash
   docker build -t url-shortener .
   ```
2. Run the container (make sure MongoDB is running):
   ```bash
   docker run -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017/urlshortener url-shortener
   ```

## API Endpoints

### 1. Shorten a URL
- **Endpoint:** `POST /shorten`
- **Request Body:**
  ```json
  { "url": "https://example.com/some/very/long/link" }
  ```
- **Response:**
  ```json
  { "shortUrl": "http://localhost:3000/abc123" }
  ```
- **Errors:**
  - `400 Bad Request` for invalid or missing URL

### 2. Redirect to Original URL
- **Endpoint:** `GET /:code`
- **Action:** Redirects to the original long URL
- **Errors:**
  - `404 Not Found` if code does not exist
  - `410 Gone` if the short URL has expired

## Database Schema
- **originalUrl**: String (required)
- **shortCode**: String (unique, required)
- **createdAt**: Date
- **expiryDate**: Date (optional)
- **clickCount**: Number (default: 0)

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `PORT`: Port for the server (default: 3000)
- `BASE_URL`: Base URL for generating short links

## Testing
You can use [Postman](https://www.postman.com/) or `curl` to test the API endpoints.

## Example Requests

**Shorten a URL:**
```bash
curl -X POST http://localhost:3000/shorten \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://www.google.com"}'
```

**Redirect:**
```bash
curl -v http://localhost:3000/abc123
```

