const kafka = require('./kafkaConfig.js');
const producer = kafka.producer();

const sendMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }],
  });
  await producer.disconnect();
};

module.exports = { sendMessage };
