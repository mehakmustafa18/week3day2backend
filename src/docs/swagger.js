const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API v2",
      version: "2.0.0",
      description:
        "Production-ready Task Manager API with MongoDB, JWT Authentication, Input Validation, and Swagger Docs.",
    },
    servers: [
      {
    url: 'https://week3day2backend.vercel.app',
    description: 'Production Server'
  },
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    // This tells Swagger that our API uses Bearer token auth
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token — get it from /api/users/login",
        },
      },
    },
  },
  // Where to find the @swagger comments
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
