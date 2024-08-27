const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie_Booking',
            version: '1.0.0',
            description: 'A description of your API',
        },
    },
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'], // Update this path to where your API documentation is located
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;