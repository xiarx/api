import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
    },
  },
  apis: ["**/routes/*.ts", "**/routes/*.js"],
};

export const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;
