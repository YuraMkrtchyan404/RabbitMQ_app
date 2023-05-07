import * as amqp from 'amqplib';

// class Connector{
//     channel: amqp.Channel;
//
//     establishConnection = async (url: string) => {
//         const connection: amqp.Connection = await amqp.connect('amqp://username:password@localhost:5672');
//         const channel: amqp.Channel = await connection.createChannel();
//         return channel;
//     }
//
//     constructor(url: string) {
//         this.establishConnection(url).then(this.channel = )
//     }
// }


const URL = 'amqp://username:password@localhost:5672';
const QUEUE_NAME = 'messageQueue';

const createChannel = async (url: string, queueName: string) => {
    const connection: amqp.Connection = await amqp.connect(url);
    const channel: amqp.Channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: false});
    return channel;
}

const addToQueue = (count: number, channel: amqp.Channel) => {
    return () => {
        const message = 'message number: ' + count;
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
        console.log(message);
        count += 1;
    };
}

const sendMessagePromise = new Promise(async (resolve) => {
    const channel = await createChannel(URL, QUEUE_NAME);
    let count = 1;
    setInterval(addToQueue(count, channel), 1000);
    resolve('The Promise is fulfilled');
})

sendMessagePromise.then((value) => {
    console.log(value);
});