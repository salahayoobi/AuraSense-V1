import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Aura Sense API',
            version: '1.0.0',
            description: 'API documentation for Aura Sense application',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
            {
                url: 'https://aura-sense.netlify.app',
            },
        ],
    },
    apis: ['Backend/routes/userRoutes.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
