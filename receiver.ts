import * as amqp from 'amqplib';

const URL = 'amqp://username:password@localhost:5672';
const QUEUE_NAME = 'messageQueue';

const createChannel = async (url: string, queueName: string) => {
    const connection: amqp.Connection = await amqp.connect(url);
    const channel: amqp.Channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: false});
    return channel;
}

const getMessagePromise = new Promise(async (resolve) => {
    const channel = await createChannel(URL, QUEUE_NAME);
    const consumer = (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
            console.log('Received: ', msg.content.toString());
            channel.ack(msg);
        }
    };
    await channel.consume('messageQueue', consumer, {noAck: false});
    resolve('The promise is fulfilled');
});

getMessagePromise.then((value) => {
    console.log(value);
});
