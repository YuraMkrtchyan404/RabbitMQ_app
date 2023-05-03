import * as amqp from 'amqplib';
// const connection = await connect('ampq://localhost');
// const channel = await connection.createChannel();
// const queue = 'messages';
// const message = 'My first rabbitmq message';
// await channel.assertQueue(queue, { durable: false });

// channel.sendToQueue(queue, Buffer.from(message));

const sendMessage = async () => {
    const connection: amqp.Connection = await amqp.connect(
        'amqp://localhost'
    );

    const channel: amqp.Channel = await connection.createChannel();

    await channel.assertQueue('messageQueue', { durable: false });

    const message = 'My first rabbitmq message';
    channel.sendToQueue('messageQueue', Buffer.from(message));
    console.log(message);

}

sendMessage();
