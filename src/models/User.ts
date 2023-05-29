import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class User {
	private id?: number;
	private name: string;
	private surname: string;
	private password: string;
	private birthday: Date;
 
	
	public getName() : string {
		return this.name;
	}
	public setName(v : string) {
		this.name = v;
	}
	
	public getSurname() : string {
		return this.surname
;
	}
	public setSurname(v : string) {
		this.surname = v;
	}
	

	constructor(name: string, surname: string, password: string, birthday: Date) {
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.birthday = birthday;
	}

	public async save(){
		await prisma.users.create({
			data: {
				name: this.name,
				surname: this.surname,
				password: this.password,
				birthday: this.birthday,
			},
		});
	}
}

//   public static findById(id: number): User | undefined {
// 	// Logic to find user by ID in the database
// }
