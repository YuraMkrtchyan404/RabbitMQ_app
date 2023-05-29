import * as amqp from 'amqplib'
import { User } from '../models/User';
import { log } from 'console';

export class RabbitMQConnection{
    public static connection: amqp.Connection | null = null;
    public static channel: amqp.Channel | null = null;
    public static queueName: string | null = null;

    public static async init(url: string, queueName: string) {
        RabbitMQConnection.connection = await amqp.connect(url);
        RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();
        await RabbitMQConnection.channel.assertQueue(queueName, { durable: false });
    }

    public static sendMessage(message: string, queueName: string) {
        RabbitMQConnection.channel!.sendToQueue(queueName, Buffer.from(message));
        console.log(message);
    };

    public static async consumeMessage(queueName: string) {
        RabbitMQConnection.channel!.consume(queueName, RabbitMQConnection.saveToDatabase, { noAck: false });
    }

    private static async saveToDatabase(msg: amqp.ConsumeMessage | null) {
        if (msg) {
            try {
                const user: User = RabbitMQConnection.generateUser(msg);
                await user.save();

                console.log('Receved new User information: ' + user.getName() + " " + user.getSurname());

                RabbitMQConnection.channel!.ack(msg);
            } catch (error) {
                log(error);
            }
        }
    };

    private static generateUser(msg: amqp.ConsumeMessage): User {
        const userInformaition: string[] = msg.content.toString().split(" ");
        const name: string = userInformaition[0];
        const surname: string = userInformaition[1];
        const password: string = userInformaition[2];
        const birthday: string = userInformaition[3];

        const user: User = new User(name, surname, password, new Date(birthday));
        return user;
    }
}