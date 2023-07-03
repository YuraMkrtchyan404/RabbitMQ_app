import { PrismaConnection } from '../../../utils/PrismaConnection'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import { UserInterface } from '../interface/UserInterface'

export class User implements UserInterface{
	private id?: number | undefined
	private name: string | undefined
	private surname: string | undefined
	private password: string | undefined
	private birthday: Date | undefined
	private email: string | undefined

	public getName(): string | undefined {
		return this.name
	}
	public setName(v: string) {
		this.name = v
	}
	public getSurname(): string | undefined {
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
	public getEmail(): string | undefined {
		return this.email
	}
	public setEmail(v: string) {
		this.email = v
	}

	constructor(userInformation: any) {
		const name: string = userInformation.data.name
		const surname: string = userInformation.data.surname
		const password: string = userInformation.data.password
		const birthday: string = userInformation.data.birthday
		const id: string = userInformation.data.id
		const email: string = userInformation.data.email

		if (name) {
			this.name = name
		}
		if (surname) {
			this.surname = surname
		}
		if (password) {
			this.password = password
		}
		if (birthday) {
			this.birthday = new Date(birthday)
		}
		if (id) {
			this.id = parseInt(id)
		}
		if (email) {
			this.email = email
		}
	}

	public async getUser() {
		try {
			if (!this.id) {
				throw new Error('Cannot get user without ID')
			}
			const user = await PrismaConnection.prisma.users.findUniqueOrThrow({
				where: { id: this.id },
			})
			const userWithoutPassword = _.omit(user, 'password')
			return userWithoutPassword
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}

	public async getUsers() {
		try {
			const users = await PrismaConnection.prisma.users.findMany()

			const usersWithoutPassword = users.map((user: any) => {
				_.omit(user, 'password')
			})
			return usersWithoutPassword
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}

	public async saveUser() {
		try {
			if (this.password) {
				const hashedPassword: string = await bcrypt.hash(this.password, 10);
				this.password = hashedPassword;
			}
			const user = await PrismaConnection.prisma.users.create({
				data: {
					name: this.name!,
					surname: this.surname!,
					password: this.password!,
					birthday: this.birthday!,
					email: this.email!
				},
			})
			const userWithoutPassword = _.omit(user, 'password')
			return userWithoutPassword

		} catch (error) {
			console.log('Error while adding new user: ', error)
			throw error
		}
	}

	public async updateUser() {
		try {
			if (!this.id) {
				throw new Error('Cannot update user without ID')
			}
			if (this.password) {
				const hashedPassword: string = await bcrypt.hash(this.password, 10);
				this.password = hashedPassword;
			}
			const user = await PrismaConnection.prisma.users.update({
				where: { id: this.id },
				data: {
					name: this.name,
					surname: this.surname,
					password: this.password,
					birthday: this.birthday,
					email: this.email
				},
			})
			const userWithoutPassword = _.omit(user, 'password')
			return userWithoutPassword

		} catch (error) {
			console.error('Error while updating the user: ', error)
			throw error
		}
	}

	public async deleteUser() {
		try {
			if (!this.id) {
				throw new Error('Cannot delete user without ID')
			}
			const user = await PrismaConnection.prisma.users.delete({
				where: { id: this.id },
			})
			const userWithoutPassword = _.omit(user, 'password')
			return userWithoutPassword

		} catch (error) {
			console.error('Error while deleting the user:', error)
			throw error
		}
	}

	public async findUserByEmail() {
		try {
			const user = await PrismaConnection.prisma.users.findUnique({
				where: { email: this.email },
			});
			return user

		} catch (error) {
			console.error('Error while finding the user by name:', error);
			throw error;
		}
	}
}
