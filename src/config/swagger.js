const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User and list of movies API",
            version: "1.0.0",
            description: "API rest (node/Express) for users managing their own movie lists (watchlist, favorites, watched) using MongoDB as database and TMDB as a external API.",
            servers: [
                {
                    url: "http://localhost:3000",
                    description: "Development server",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                }
            },
        },
    },
    apis: ["./src/presentation/routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;