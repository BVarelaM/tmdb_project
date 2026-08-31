const amqp = require('amqplib');

let channel = null;
let connection = null;

const connectRabbitMQ = async (retries = 5, delay = 3000) => {
  const rabbitURI = 
    process.env.RABBITMQ_URI || 
    process.env.RABBITMQ_URL || 
    'amqp://guest:guest@rabbitmq:5672';

  for (let i = 1; i <= retries; i++) {
    try {
      connection = await amqp.connect(rabbitURI);
      channel = await connection.createChannel();
      console.log('RabbitMQ connection successful');
      return;
    } catch (error) {
      console.error(`Attempt ${i}/${retries} - Something went wrong connecting with RabbitMQ:`, error.message);
      
      if (i < retries) {
        console.log(`Retrying connection in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Failed to connect to RabbitMQ after maximum retries.');
      }
    }
  }
};

const publishEvent = async (queueName, data) => {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
};

module.exports = {
  connectRabbitMQ,
  publishEvent
};