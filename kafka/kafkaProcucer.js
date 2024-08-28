// kafkaService.js

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ticket-status-service',
  brokers: ['localhost:9092']  // Adjust this to match your Kafka brokers
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'ticket-status-group' });

const runProducer = async () => {
  await producer.connect();
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(message) }
    ],
  });
};

const runConsumer = async (processMessage) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ticket-booking-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const parsedMessage = JSON.parse(message.value.toString());
      await processMessage(parsedMessage);
    },
  });
};

module.exports = {
  runProducer,
  sendMessage,
  runConsumer
};
