const kafka = require('./kafkaConfig.js');
const Ticket = require('../models/ticketModel.js');
const Movie = require('../models/movieModel.js');
const consumer = kafka.consumer({ groupId: 'ticket-group' });

const consumeMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ticket-booked', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Kafka Producers run method triggered');
      const data = JSON.parse(message.value.toString());
    
      const movie = await Movie.findOne({ movieName: data.movieName, theatreName: data.theatreName })
      

      let ticketsAlreadyBooked = 0;
      const tickets = await Ticket.find({  movieName: data.movieName, theatreName: data.theatreName }); // Fetch all tickets
      
      console.log("Entering Kafka Consumer");
      for (const ticket of tickets) {
        ticketsAlreadyBooked += ticket.numberOfBookedTickets;
      }

      if (ticketsAlreadyBooked === movie.totalSeatsAlloted) {
        movie.ticketStatus = 'SOLD OUT';
        
        await movie.save();
      }
    },
  });
};

module.exports = { consumeMessages };
