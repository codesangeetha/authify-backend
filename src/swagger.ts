import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authify API",
      version: "1.0.0",
      description: "API documentation for Authify backend",
    },
    servers: [
      {
        url: "http://localhost:5000", 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], 
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
