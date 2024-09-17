import { ISchool } from "@/entities/interfaces/school.interface";
import { IUser } from "@/entities/interfaces/user.interface";
import { Post } from "@/entities/models/post.entity";
import { School } from "@/entities/models/school.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as bcrypt from 'bcrypt';
import { TypeUser, User } from "@/entities/models/user.entity";

export default class PostSeeder implements Seeder {
    track = false;

    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(Post);
        const schoolRepository = dataSource.getRepository(School);
        const userRepository = dataSource.getRepository(User);

        let school : ISchool = {
            name: "CreatePostSchool",
            status: true,
        }

        school = await schoolRepository.save(school);


        let user : IUser = {
            email: "usercreatepost@gmail.com",
            admin: true,
            password: await bcrypt.hash("123456", 10),
            status: true,
            TypeUser: TypeUser.Professor,
            username: "usercreatepost",
            schools: [school] 
        }
        
        user = await userRepository.save(user);

        await repository.insert([
            {
                title: "Post 1",
                content: "Content 1",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 2",
                content: "Content 2",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 3",
                content: "Content 3",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 4",
                content: "Content 4",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 5",
                content: "Content 5",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 6",
                content: "Content 6",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 7",
                content: "Content 7",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 8",
                content: "Content 8",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 9",
                content: "Content 9",
                status: true,
                user: user,
                school: school,
                isDraft: false
            },
            {
                title: "Post 10",
                content: "Content 10",
                status: true,
                user: user,
                school: school,
                isDraft: false
            }
        ])
    }
}