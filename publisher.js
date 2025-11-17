const amqp = require("amqplib/callback_api");

const USERNAME = "client";
const PASSWORD = "1234";
const HOST = "localhost";
const PORT = "5672";
const VHOST = "demo01";

const EXCHANGE = "notifications";

const uri = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${VHOST}`;

amqp.connect(uri, (error0, connection) => {
  if (error0) throw error0;

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    // fanout exchange
    channel.assertExchange(EXCHANGE, "fanout", {
      durable: false,
    });

    console.log("Publisher started...");

    setInterval(() => {
      const messageObj = {
        sensor_id: "s01",
        temperature: (Math.random() * 3 + 36).toFixed(2), // 36 - 39
        timestamp: new Date().toISOString(),
      };

      const message = JSON.stringify(messageObj);

      channel.publish(EXCHANGE, "", Buffer.from(message));
      console.log(`[x] Sent: ${message}`);
    }, 3000);
  });
});
