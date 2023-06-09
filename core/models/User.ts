import { PrismaClient } from '@prisma/client'
import { RabbitMQConnection } from '../utils/RabbitMQConnection'
import { MessagingCodes } from '../utils/messagingcodes.enum'

const prisma = new PrismaClient()

export class User {
	private id?: number
	private name: string
	private surname: string
	private password: string
	private birthday: Date


	public getName(): string {
		return this.name
	}
	public setName(v: string) {
		this.name = v
	}

	public getSurname(): string {
		return this.surname
	}
	public setSurname(v: string) {
		this.surname = v
	}

	public getId(): number | undefined {
		return this.id
	}
	public setId(v: number) {
		this.id = v
	}

	constructor(name: string, surname: string, password: string, birthday: Date, id?: number) {
		this.name = name
		this.surname = surname
		this.password = password
		this.birthday = birthday
		this.id = id
	}

	public async getAndSendBackToRabbitMQ(messageId: string, queueName: string) {
		try {
			if (!this.id) {
				throw new Error('Cannot get user without ID')
			}
			const user = await prisma.users.findUnique({
				where: { id: this.id },
			})

			if (user) {
				await RabbitMQConnection.sendMessage({
					id: messageId,
					type: MessagingCodes.GET_RESPONSE,
					data: { user },
				}, queueName)
			} else {
				await RabbitMQConnection.sendMessage({ id: messageId, error: "User not found" }, queueName)
			}
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}

	public async getManyAndSendBackToRabbitMQ(messageId: string, queueName: string){
		try {
			const users = await prisma.users.findMany()

			if (users) {
				await RabbitMQConnection.sendMessage({
					id: messageId,
					type: MessagingCodes.GET_MANY_RESPONSE,
					data: { users },
				}, queueName)
			} else {
				await RabbitMQConnection.sendMessage({ id: messageId, error: "Users not found" }, queueName)
			}
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}

	public async saveAndSendBackToRabbitMQ(messageId: string, queueName: string) {
		try {
			const user = await prisma.users.create({
				data: {
					name: this.name,
					surname: this.surname,
					password: this.password,
					birthday: this.birthday,
				},
			})

			if (user) {
				await RabbitMQConnection.sendMessage({
					id: messageId,
					type: MessagingCodes.ADD_RESPONSE,
					data: { user },
				}, queueName)
			} else {
				await RabbitMQConnection.sendMessage({ id: messageId, error: "User not added" }, queueName)
			}
		} catch (error) {
			console.log('Error while adding new user: ', error);
			throw error
		}
	}

	public async updateAndSendBackToRabbitMQ(messageId: string, queueName: string) {
		try {
			if (!this.id) {
				throw new Error('Cannot update user without ID')
			}

			const user = await prisma.users.update({
				where: { id: this.id },
				data: {
					name: this.name,
					surname: this.surname,
					password: this.password,
					birthday: this.birthday,
				},
			})

			if (user) {
				await RabbitMQConnection.sendMessage({
					id: messageId,
					type: MessagingCodes.UPDATE_RESPONSE,
					data: { user },
				}, queueName)
			} else{
				await RabbitMQConnection.sendMessage({ id: messageId, error: "User not updated" }, queueName)
			}
		} catch (error) {
			console.error('Error while updating the user: ', error)
			throw error
		}
	}

	public async deleteAndSendBackToRabbitMQ(messageId: string, queueName: string) {
		try {
			if (!this.id) {
				throw new Error('Cannot delete user without ID')
			}

			const user = await prisma.users.delete({
				where: { id: this.id },
			})

			if (user) {
				await RabbitMQConnection.sendMessage({
					id: messageId,
					type: MessagingCodes.UPDATE_RESPONSE,
					data: { user },
				}, queueName)
			} else{
				await RabbitMQConnection.sendMessage({ id: messageId, error: "User not deleted" }, queueName)
			}
		} catch (error) {
			console.error('Error while deleting the user:', error)
			throw error
		}
	}

	public static generateEmptyUser(): User {
		return new User("", "", "", new Date())
	}
}
