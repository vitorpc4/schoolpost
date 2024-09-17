import { TypeUser, User } from "@/entities/models/user.entity"
import { DataSource } from "typeorm"
import { Seeder, SeederFactoryManager } from "typeorm-extension"

export default class UserSeeder implements Seeder {
    track = false

    public async run(dataSource: DataSource,
        factoryManager: SeederFactoryManager): Promise<any> 
    {
        const repository = dataSource.getRepository(User)
        
        await repository.insert([
            {
                email: "vitorhlaiam@gmail.com",
                password: "123456",
                admin: true,
                status: true,
                TypeUser: TypeUser.Professor,
                username: "vitorhlaiam"
            },
            {
                email: "teste@gmail.com.br",
                password: "123456",
                admin: false,
                status: true,
                TypeUser: TypeUser.Professor,
                username: "teste"
            },
            {
                email: "teste2@gmail.com.br",
                password: "123456",
                admin: false,
                status: true,
                TypeUser: TypeUser.Professor,
                username: "teste2"
            },
            {
                email: "teste3@gmailcom.br",
                password: "123456",
                admin: false,
                status: true,
                TypeUser: TypeUser.Professor,
                username: "teste3"
            }, 
            {
                email: "teste4@gmail.com.br",
                password: "123456",
                admin: false,
                status: true,
                TypeUser: TypeUser.Professor,
                username: "teste4"
            }
        ])
    }
}