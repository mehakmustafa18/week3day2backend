# Task Manager API v2

Production-ready REST API built with Node.js, Express, MongoDB, JWT Authentication, and Swagger Docs.

---

## How to Run

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Setup MongoDB Atlas (free cloud database)
1. Go to **mongodb.com/atlas** → create free account
2. Create a free cluster
3. Go to **Database Access** → create a username and password
4. Go to **Network Access** → click "Allow Access from Anywhere"
5. Go to **Connect** → copy your connection string

### Step 3 — Create your .env file
```bash
# Create a file named .env in the root folder
# Copy this and fill in your values:

MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=any_long_random_string_here
PORT=3000
```

### Step 4 — Start the server
```bash
npm run dev
```

### Step 5 — Open in browser
- API Root: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs

---

## API Endpoints

### Auth Routes (no token needed)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Create new account |
| POST | `/api/users/login` | Login, get JWT token |
| GET | `/api/users/profile` | Get your profile (token required) |

### Task Routes (JWT token required for all)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all your tasks |
| GET | `/api/tasks?title=learn` | Filter tasks by title |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/stats` | Get your task statistics |

---

## How to use JWT token in Postman
1. Call `/api/users/login` first
2. Copy the `token` from the response
3. In every other request, add this Header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

---

## Folder Structure
```
task-manager-v2/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Task.js             # Task schema
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── validateRequest.js  # Validation error handler
│   │   └── errorHandler.js     # Global error handler
│   ├── controllers/
│   │   ├── authController.js   # Register, login logic
│   │   └── taskController.js   # CRUD logic
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── taskRoutes.js       # Task endpoints
│   ├── docs/
│   │   └── swagger.js          # Swagger config
│   └── server.js               # App entry point
├── .env.example                # Template for .env
├── .gitignore                  # Ignores node_modules and .env
├── package.json
├── postman-collection.json
└── README.md
```
