import { PrismaClient } from '@prisma/client';
import { RabbitMQConnection } from '../utils/RabbitMQConnection';
import { MessagingCodes } from '../utils/messagingcodes.enum';

const prisma = new PrismaClient();

export class User {
	private id?: number;
	private name: string;
	private surname: string;
	private password: string;
	private birthday: Date;


	public getName(): string {
		return this.name;
	}
	public setName(v: string) {
		this.name = v;
	}

	public getSurname(): string {
		return this.surname;
	}
	public setSurname(v: string) {
		this.surname = v;
	}

	public getId(): number | undefined {
		return this.id;
	}
	public setId(v: number) {
		this.id = v;
	}

	constructor(name: string, surname: string, password: string, birthday: Date, id?: number) {
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.birthday = birthday;
		this.id = id;
	}

	public async get() {
		try {
			if (!this.id) {
				throw new Error('Cannot get user without ID');
			}
			const user = await prisma.users.findUnique({
				where: { id: this.id },
			});

			if (user){
				RabbitMQConnection.sendMessage({
					type: MessagingCodes.GET_USER_RESPONSE,
					data: {
						id: user.id,
						name: user.name,
						surname: user.surname,
						password: user.password,
						birthday: user.birthday,
					},
				}, RabbitMQConnection.queueName!)
			}
		}catch (error){
			console.error('Error while getting the user: ', error)
		}
	}

	public async save() {
		await prisma.users.create({
			data: {
				name: this.name,
				surname: this.surname,
				password: this.password,
				birthday: this.birthday,
			},
		});

	}
	
	public async update() {
		try {
			if (!this.id) {
				throw new Error('Cannot update user without ID');
			}

			await prisma.users.update({
				where: { id: this.id },
				data: {
					name: this.name,
					surname: this.surname,
					password: this.password,
					birthday: this.birthday,
				},
			});
		} catch (error) {
			console.error('Error while updating the user: ', error);
			throw error;
		}
	}

	public async delete() {
		try {
			if (!this.id) {
				throw new Error('Cannot delete user without ID');
			}

			await prisma.users.delete({
				where: { id: this.id },
			});
		} catch (error) {
			console.error('Error while deleting the user:', error);
			throw error;
		}
	}

	public static generateEmptyUser(): User {
		return new User("", "", "", new Date());
	}
}
