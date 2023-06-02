import * as amqp from 'amqplib'
import { User } from '../models/User';
import { log } from 'console';
import { MessagingCodes } from './messagingcodes.enum';

export class RabbitMQConnection {
    public static connection: amqp.Connection | null = null;
    public static channel: amqp.Channel | null = null;
    public static queueName: string | null = null;

    public static async init(url: string, queueName: string) {
        RabbitMQConnection.connection = await amqp.connect(url);
        RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();
        await RabbitMQConnection.channel.assertQueue(queueName, { durable: false });
    }

    public static sendMessage(msg: { type: MessagingCodes, data: any }, queueName: string) {
        RabbitMQConnection.channel!.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)));
        console.log('SENT: ', JSON.stringify(msg));
    }

    // Consumer part

    public static async consumeMessage(queueName: string) {
        RabbitMQConnection.channel!.consume(queueName, RabbitMQConnection.manipulateDatabase, { noAck: false });
    }

    private static async manipulateDatabase(msg: amqp.ConsumeMessage | null) {
        if (msg) {
            const informationString: string = msg.content.toString('utf8');
            const information: any = JSON.parse(informationString);
            const messageDestination: MessagingCodes = information.type;
            log(information);
            try {
                switch (messageDestination) {
                    case MessagingCodes.GET_USER:
                        await RabbitMQConnection.getUserFromDatabase(information);
                        break;

                    case MessagingCodes.ADD_USER:
                        await RabbitMQConnection.addUserToDatabase(information);
                        break;

                    case MessagingCodes.UPDATE_USER:
                        await RabbitMQConnection.updateUserInDatabase(information);
                        break;

                    case MessagingCodes.DELETE_USER:
                        await RabbitMQConnection.deleteUserFromDatabase(information);
                        break;

                    case MessagingCodes.GET_USER_RESPONSE:
                        await RabbitMQConnection.receiveUserInformation(information);
                        break;
                    default:
                        log("No matching condition found for messageDestination");
                        break;
                }
                RabbitMQConnection.channel!.ack(msg);
            } catch (error) {
                log(error);
            }
        }
    }

    // User CRUD operations

    private static async getUserFromDatabase(userInformaition: any) {
        const id: number = parseInt(userInformaition.data.id);
        const user: User = User.generateEmptyUser();
        user.setId(id);
        await user.get();
        log('Retrieved user with id: ', id, ' and sent to the rabbit');
    }

    private static async addUserToDatabase(userInformaition: any) {
        const user: User = RabbitMQConnection.generateUser(userInformaition);
        await user.save();
        console.log('Receved new User information: ' + user.getName() + " " + user.getSurname());
    }

    private static async updateUserInDatabase(userInformaition: any) {
        const user: User = RabbitMQConnection.generateUser(userInformaition);
        const id: number = parseInt(userInformaition.data.id);
        user.setId(id);
        await user.update();
        log('RECEIVED: ', JSON.stringify(userInformaition));
    }

    private static async deleteUserFromDatabase(userInformaition: any) {
        const id: number = parseInt(userInformaition.data.id);
        const user: User = User.generateEmptyUser();
        user.setId(id);
        await user.delete();
        log('DELETED: ', JSON.stringify(userInformaition));
    }

    private static async receiveUserInformation(userInformaition: any) {
        const user: User = RabbitMQConnection.generateUser(userInformaition);
        const id: number = parseInt(userInformaition.data.id);
        user.setId(id);
        log('Response User: ', user);
    }

    private static generateUser(userInformaition: any): User {
        const name: string = userInformaition.data.name;
        const surname: string = userInformaition.data.surname;
        const password: string = userInformaition.data.password;
        const birthday: string = userInformaition.data.birthday;
        const user: User = new User(name, surname, password, new Date(birthday));
        return user;
    }
}