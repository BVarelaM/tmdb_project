require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database/db');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const PORT = process.env.PORT || 3000;

async function startServer() {

    try {
        await connectDB();
        await connectRabbitMQ();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();