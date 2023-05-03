import * as amqp from 'amqplib';
// import client, { Connection, Channel, ConsumeMessage } from 'amqplib';
// const connection = await Connection('ampq://localhost');
// const channel = await connection.createChannel();
// const queue = 'messages';
// const message = 'My first rabbitmq message';
// await channel.assertQueue(queue, { durable: false });

// channel.consume(queue, (msg: ConsumeMessage) => {
//     console.log(` [x] Received ${msg.content.toString()}`);
// });

const getMessage = async () => {

    const connection: amqp.Connection = await amqp.connect(
        'amqp://localhost'
    );

    const consumer = (channel: amqp.Channel) => (msg: amqp.ConsumeMessage | null): void => {
        if (msg) {
            console.log('Received: ', msg.content.toString());
            channel.ack(msg);
        }
    }



    const channel: amqp.Channel = await connection.createChannel();

    await channel.assertQueue('messageQueue');

    await channel.consume('messageQueue', consumer(channel));

}

getMessage();