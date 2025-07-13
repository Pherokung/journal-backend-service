# Journal Backend Service

This is the backend service for the Journal App, built with Next.js (App Router), TypeScript, and MongoDB. It provides RESTful API endpoints for user authentication and journal entry management, and includes a robust suite of Jest unit/integration tests.

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/your-username/mindglow-journal-backend.git
cd mindglow-journal-backend-service
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Environment Variables**

Copy `.env.local` and `.env.local.test` from the repo or create them in the root directory:

```env
# .env.local
MONGODB_URI=your-mongodb-uri
JWT_SECRET=secret
```

```env
# .env.local.test
MONGODB_URI=your-mongodb-uri
JWT_SECRET=secret
```

> **Note:** For development, you can use a free MongoDB Atlas cluster from [https://www.mongodb.com/atlas](here) .

### 4. **Run the Development Server**

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Design Choices

- **Next.js App Router**: Uses the latest Next.js features for API routing and server components.
- **TypeScript**: Ensures type safety and better developer experience.
- **MongoDB with Mongoose**: Provides a flexible, schema-based solution for storing users and journal entries.
- **JWT Authentication**: Secure, stateless authentication using JSON Web Tokens, with cookies for session management.
- **In-memory MongoDB for Testing**: Uses `mongodb-memory-server` to spin up a real MongoDB instance in memory for fast, isolated tests.
- **Modular Structure**: Models, utilities, and API routes are separated for maintainability and scalability.

---

## 🧪 Running Tests

This project uses **Jest** and **ts-jest** for unit and integration testing.

### **How to Run Tests**

```sh
npm test
```

### **Jest Coverage and Configuration**

- All API endpoints and core logic are covered, including authentication, CRUD operations, and error handling.
- Tests are located in the `tests/` directory and mirror the API structure.
- `globalSetup` runs the in-memory MongoDB server before tests.
- `setupFilesAfterEnv` ensures each test starts with a clean database.


---

## 📁 Project Structure

```
app/                # Next.js app directory (API routes, pages)
models/             # Mongoose models (User, JournalEntry)
lib/                # Utility libraries (dbConnect, auth)
tests/              # Jest test files and test utilities
  └── utils/        # Test DB setup, mock auth helpers
```

---

## 🛠️ API Overview

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Log in and receive a JWT cookie
- **POST /api/auth/logout**: Log out (clear cookie)
- **GET /api/journal**: Get all journal entries for the authenticated user
- **POST /api/journal**: Create a new journal entry
- **PUT /api/journal/[id]**: Update a journal entry
- **DELETE /api/journal/[id]**: Delete a journal entry

---

## 🧑‍💻 Challenges 


---

