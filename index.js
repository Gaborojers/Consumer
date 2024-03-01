const amqp = require("amqplib");

const exchangeName = process.env.AMQP_EXCH || "";
const routingKey = process.env.AMQP_ROUTINGKEY || "";
const options = {
  username: 'Gaboneil',
  password: 'LGSC06042004',
};
const queue = "initial";

const consumer = async () => {
  const conn = await amqp.connect(
    "amqp://52.21.114.121",
    options
  );
  const ch = await conn.createChannel();
  console.log(
    " [*] Esperando mensajes en la cola %s. Para salir, presiona CTRL+C",
    queue
  );

  await ch.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());

        console.log(" [x] Recibido '%s'", data);
        const body = JSON.stringify({
          idPay: data.idPay,
          product: data.product, 
          date: data.date,
          price: data.price,
        });
        console.log(body);
        await fetch("http://localhost:3001/payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
        ch.ack(msg);
      } else {
        console.error("El mensaje es nulo");
      }
    },
    { noAck: false }
  );
};


consumer();