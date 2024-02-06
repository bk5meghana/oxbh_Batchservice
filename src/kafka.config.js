require("dotenv").config();
const { Kafka } = require("kafkajs");

const kafkaHosts = process.env.MESSAGEBUS_BROKER.split(",");

let kafkaProducer;
let producerReady = false;

async function setupProducer(kafkaHost) {
  const kafka = new Kafka({
    clientId: "batchservice",
    brokers: [kafkaHost] ,
   
  });

  kafkaProducer = kafka.producer();

  try {
    await kafkaProducer.connect();
    producerReady = true;
  } catch (error) {
    console.error(`Error establishing connection to Kafka: ${error.message}`);
    producerReady = false;
    throw error; // Re-throw the error to indicate failure in setup
  }
}

// Define an async function to perform the setup
async function initializeProducer() {
  // Attempt to setup the producer with the available Kafka hosts
  for (const kafkaHost of kafkaHosts) {
    try {
      await setupProducer(kafkaHost);
      break; // Break the loop if successful setup
    } catch (error) {
      console.error(`Error during initial Kafka setup: ${error.message}`);
    }
  }
}

// Call the async function to initialize the producer
initializeProducer()
  .then(() => {
    // The producer is now initialized
    console.log("Producer initialization completed successfully");
  })
  .catch((error) => {
    console.error("Error during producer initialization:", error);
  });

module.exports = {
  async pushDataToMessageBus(messageData) {
    console.log("producerReady==============>", producerReady, messageData);

    if (!producerReady) {
      // If Kafka producer is not ready, try connecting to other Kafka hosts
      for (const kafkaHost of kafkaHosts) {
        try {
          await setupProducer(kafkaHost);
          break; // Break the loop if successful setup
        } catch (error) {
          console.error(
            `Error establishing connection to Kafka: ${error.message}`
          );
        }
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const result = await kafkaProducer.send({
          topic: "batchservice",
          messages: [{ value: JSON.stringify(messageData) }],
        });

        //console.log("Sent message:", result);
        resolve({
          statusCode: 200, // OK
          body: JSON.stringify({
            message: "Message sent to Kafka successfully",
          }),
        });
      } catch (err) {
        console.error("Error sending to Kafka:", err);
        reject({
          statusCode: 500, // Internal Server Error
          body: {
            error: "Error sending to Kafka",
            details: err.message,
          },
        });
      }
    });
  },
};
