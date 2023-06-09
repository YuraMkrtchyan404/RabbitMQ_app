import { PrismaConnection } from '../utils/PrismaConnection'

export class User {
	private id?: number | undefined
	private name: string | undefined
	private surname: string | undefined
	private password: string | undefined
	private birthday: Date | undefined


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

	constructor(userInformation: any) {
		const name: string = userInformation.data.name
		const surname: string = userInformation.data.surname
		const password: string = userInformation.data.password
		const birthday: string = userInformation.data.birthday
		const id: string = userInformation.data.id
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
	}

	public async getUser() {
		try {
			if (!this.id) {
				throw new Error('Cannot get user without ID')
			}
			const user = await PrismaConnection.prisma.users.findUnique({
				where: { id: this.id },
				rejectOnNotFound: true,
			})
			return user
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}
	
	public async getUsers() {
		try {
			const users = await PrismaConnection.prisma.users.findMany()
			return users
		} catch (error) {
			console.error('Error while getting the user: ', error)
			throw error
		}
	}

	public async saveUser() {
		try {
			const user = await PrismaConnection.prisma.users.create({
				data: {
					name: this.name!,
					surname: this.surname!,
					password: this.password!,
					birthday: this.birthday!,
				},
			})
			return user
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
			const user = await PrismaConnection.prisma.users.update({
				where: { id: this.id },
				data: {
					name: this.name,
					surname: this.surname,
					password: this.password,
					birthday: this.birthday,
				},
			})
			return user
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
			return user
		} catch (error) {
			console.error('Error while deleting the user:', error)
			throw error
		}
	}
}
