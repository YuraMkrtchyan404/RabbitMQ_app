import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { UserRoutes } from "./routes/UserRouts"
import { RabbitMQConnection } from "./utils/RabbitMQConnection"
import { error } from "console"
import { MessageHandler } from "./utils/MessageHandler"
import { PasswordHashingMiddleware } from "./middlewares/PasswordHash.middleware"

const app = express()
const URL = "amqp://username:password@localhost:5672"
const RETRY_QUEUE_NAME = "retryQueue"
const QUEUE_NAME = "messageQueue"
const port = 3000

app.use(bodyParser.json())
app.use(cors())
app.use(PasswordHashingMiddleware.hashPassword)

const main = async () => {

    const userRoutes = new UserRoutes(QUEUE_NAME)
    app.use(userRoutes.getRouter())

    await RabbitMQConnection.init(URL, QUEUE_NAME)
    await RabbitMQConnection.consumeMessage(RETRY_QUEUE_NAME, MessageHandler.receiveResponse).catch((err) => {
        console.error("Failed to consume the message:", err)
        process.exit(1)
    })
}

app.listen(port, () => {
    console.log("Server listening on port 3000")
})

main().catch((err) => {
    error("Failed to initialize the app:", err)
    process.exit(1)
})