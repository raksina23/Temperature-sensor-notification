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

    channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    channel.assertQueue("", { exclusive: true }, (error2, q) => {
      if (error2) throw error2;

      console.log(`[*] DisplayService listening on queue: ${q.queue}`);

      channel.bindQueue(q.queue, EXCHANGE, "");

      channel.consume(
        q.queue,
        (msg) => {
          console.log("[DisplayService] Received:", msg.content.toString());
        },
        { noAck: true }
      );
    });
  });
});
