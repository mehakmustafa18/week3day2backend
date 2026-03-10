// Load .env variables FIRST — before anything else
require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/db");
const swaggerSpec = require("./docs/swagger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");


// CONNECT TO MONGODB

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// GLOBAL MIDDLEWARE


// Parse incoming JSON request bodies
app.use(express.json());


// SWAGGER DOCS
// Visit http://localhost:3000/api-docs

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES

app.use("/api/users", authRoutes);  // register, login, profile
app.use("/api/tasks", taskRoutes);  // CRUD for tasks

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: "Task Manager API v2 is running! Visit /api-docs for documentation.",
  });
});


// ERROR HANDLER — must be registered LAST

app.use(errorHandler);


// START SERVER

app.listen(PORT, () => {
  console.log(`Server running at:  http://localhost:${PORT}`);
  console.log(`Swagger Docs at:    http://localhost:${PORT}/api-docs`);
});
// SWAGGER DOCS
app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    url: '/api-docs-json'
  }
}));

// Swagger JSON endpoint
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});