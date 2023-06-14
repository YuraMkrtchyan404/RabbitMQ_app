import { RabbitMQConnection } from "./utils/RabbitMQConnection"
import { error } from "console"
import { MessageHandler } from "./utils/MessageHandler"

const URL = "amqp://username:password@localhost:5672"
const QUEUE_NAME = "messageQueue"
const RETRY_QUEUE_NAME = "retryQueue"

const main = async () => {

    await RabbitMQConnection.init(URL, RETRY_QUEUE_NAME)
    await RabbitMQConnection.consumeMessage(QUEUE_NAME, (msg) => {
        MessageHandler.handleMessage(msg, RETRY_QUEUE_NAME)
    }).catch((err) => {
        console.error("Failed to consume the message:", err)
        process.exit(1)
    })
    console.log('Started consuming from messageQueue')

}

main().catch((err) => {
    error("Failed to initialize the app:", err)
    process.exit(1)
})
