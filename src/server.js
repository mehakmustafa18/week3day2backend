require("dotenv").config();
const cors = require("cors");
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

// MIDDLEWARE
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// SWAGGER JSON ENDPOINT
app.get("/api-docs-json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// SWAGGER UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "https://week3day2backend.vercel.app/api-docs-json"
  }
}));

// ROUTES
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: "Task Manager API v2 is running! Visit /api-docs for documentation.",
  });
});

// ERROR HANDLER
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at:  http://localhost:${PORT}`);
  console.log(`Swagger Docs at:    http://localhost:${PORT}/api-docs`);
});