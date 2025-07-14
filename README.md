# Journal Backend Service

This is the backend service for the Journal App, built with Next.js (App Router), TypeScript, and MongoDB. It provides RESTful API endpoints for user authentication and journal entry management, including support for tags on journal entries. The service also includes a robust suite of Jest unit/integration tests.

---

## 🛠️ Features

- **API Overview**
  - **POST /api/auth/register**: Register a new user
  - **POST /api/auth/login**: Log in and receive a JWT cookie
  - **POST /api/auth/logout**: Log out (clear cookie)
  - **GET /api/journal**: Get all journal entries for the authenticated user
  - **POST /api/journal**: Create a new journal entry (optionally include a `tags` array)
  - **PUT /api/journal/[id]**: Update a journal entry
  - **DELETE /api/journal/[id]**: Delete a journal entry
  - **PATCH /api/journal/[id]**: Add or remove a tag from a journal entry  
    - Request body: `{ "action": "add" | "remove", "tag": "tagName" }`
    - Only the entry's owner can modify tags

- **Error Handling**
  - Implement proper error handling for all API routes while returning meaningful error messages for different scenarios
 
- **Testing**
  - Multiple test files are written using Jest to test critical API endpoints, focusing on authentication and journal entry operations.
 
- **Deployment**
  - Deploy the backend on Vercel

---

## 📁 Project Structure

```
app/                        # Next.js app directory
    └── api/ 
        └── auth/           # Auth operations
        └── journal/        # CRUD operations
models/                     # Mongoose models 
lib/                        # Utility libraries
tests/                      
    └── api/          
        └── auth/           # Auth testing
        └── journal/        # CRUD testing
    └── utils/              # Test DB setup, helpers
```

---

## 🚀 Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/Pherokung/journal-backend-service.git
cd journal-backend-service
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Environment Variables**

create `.env.local` and `.env.local.test` files in the root directory:

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

> **Note:** For MONGODB_URI, you can use a free MongoDB Atlas cluster from [here](https://www.mongodb.com/atlas).

### 4. **Run the Development Server**

```sh
npm run dev
```

The API can be accessed from [http://localhost:3000/api](http://localhost:3000/api).

Testing some of the APIs using the curl commands:

```sh
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt -v

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt -v

# Create Entry (with tags)
curl -X POST http://localhost:3000/api/journal \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Entry","content":"Test Content","tags":["tag1","tag2"]}'

# Get Entries (returns tags)
curl -X GET http://localhost:3000/api/journal \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Add a tag to an entry
curl -X PATCH http://localhost:3000/api/journal/<ENTRY_ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"action":"add","tag":"newtag"}'

# Remove a tag from an entry
curl -X PATCH http://localhost:3000/api/journal/<ENTRY_ID> \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"action":"remove","tag":"tag1"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt -v
```  

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
npm test <file_name>
```

The name of the test files:
- register.test.ts
- delete.test.ts
- post.test.ts
- update.test.ts
- tags.test.ts

### **Jest Coverage and Configuration**

- All API endpoints and core logic are covered, including authentication, CRUD operations, and error handling.
- Tests are located in the `tests/` directory and mirror the API structure.
- `globalSetup` runs the in-memory MongoDB server before tests.
- `setupFilesAfterEnv` ensures each test starts with a clean database.


---

## ☁️ Vercel

create `.env.production` file in the root directory:

```env
# .env.local
MONGODB_URI=your-mongodb-uri
JWT_SECRET=secret
NODE_ENV=production
```

### **Deployment**

```sh
npm install -g vercel       # If not installed

vercel login                # Login to Vercel

vercel --prod               # Run deployment
```

The deployed app (which I deployed with this repo) would look like this: https://journal-backend-service.vercel.app/


## 🧑‍💻 Challenges 

Some topics are new to me, such as JWT Authentication and Jest unit tests. I need to spend some time understanding their documentation and usage. 

I have some experience in authentication methods but I have never used JWT. So, after trying to comprehend its documentation, it does not take long to get familiar with it.

On the contrary, Jest is completely new for me. I have to spend quite some time to understand its usage. Additionally, I need to design the test to cover and handle all errors, which requires designing beforehand.

---

