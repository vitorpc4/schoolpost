import { IPost } from "@/entities/interfaces/posts.interface";
import { ISchool } from "@/entities/interfaces/school.interface";
import { IUser } from "@/entities/interfaces/user.interface";
import { Post } from "@/entities/models/post.entity";
import { School } from "@/entities/models/school.entity";
import { TypeUser, User } from "@/entities/models/user.entity";
import schoolFactory from "@/seeders/factories/school.factory";
import userFactory from "@/seeders/factories/user.factory";
import PostSeeder from "@/seeders/post.seeder";
import SchoolSeeder from "@/seeders/school.seeder";
import UserSeeder from "@/seeders/user.seeder";
import { PostsService } from "@/services/post.service";
import { SchoolsService } from "@/services/school.service";
import { UsersService } from "@/services/user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { log } from "console";
import { before } from "node:test";
import { delay } from "rxjs";
import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { createDatabase, dropDatabase, dropPostgresDatabase, runSeeders, SeederOptions } from "typeorm-extension";

describe('PostService', () => {
    const configData : DataSourceOptions & SeederOptions = {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'test',
        username: 'root',
        password: 'password',
        entities: [Post,User,School],
        synchronize: true,
        dropSchema: true,
        seeds: [SchoolSeeder, UserSeeder, PostSeeder],
        factories: [schoolFactory, userFactory],
        migrationsRun: true,
    }

    let postService: PostsService;
    let userService: UsersService;
    let schoolService: SchoolsService;
    let repositoryUser : Repository<User>;
    let repositorySchool : Repository<School>;
    let repositoryPost : Repository<Post>;

    let module: TestingModule;


    before(async () => {
        await dropDatabase({
            ifExist: true,
            options: configData
        })

        await createDatabase({
            ifNotExist: true,
            options: configData
        });

        const dataSource = new DataSource(configData);
        await dataSource.initialize();

        await runSeeders(dataSource);

        if (dataSource.isInitialized) await dataSource.destroy();
    })

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(configData),
                
                TypeOrmModule.forFeature([Post, User, School])
            ],
            providers: [PostsService, UsersService, SchoolsService]
        }).compile();
        
    
        postService = module.get<PostsService>(PostsService);
        userService = module.get<UsersService>(UsersService);
        schoolService = module.get<SchoolsService>(SchoolsService);
        repositoryPost = module.get<Repository<Post>>(getRepositoryToken(Post));
        repositoryUser = module.get<Repository<User>>(getRepositoryToken(User));
        repositorySchool = module.get<Repository<School>>(getRepositoryToken(School));
    });

    it('deve trazer um post', async () => {
        const id: number = 1.

        postService.findById = jest.fn().mockReturnValueOnce({
            id,
            title: "Teste",
            content: "Teste",
            isDraft: false,
            status: true,
            school: {
                id: "04c0dde30654419ab1f01007a2297027",
                name: "Teste",
                status: true,
                users: [1],
                posts: []
            },
            user: {
                id: 1,
                name: "Teste",
                email: "teste@gmail.com",
                admin: true,
            }
        })
        
        const result = await postService.findById(id);
        

        log(result);

        expect(result.id).toEqual(id);
    })

    it('Solicitação de todos os posts', async () => {
        const result = await postService.findAll(1, 10);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('Criação de post', async () => {
        const getSchool = await schoolService.findAll(1, 10);
        const getUser = await userService.findById(1);


        getUser.schools = [getSchool[0]];
        
        const r = await userService.update(getUser);

        const post:IPost = {
            content: 'Teste de conteúdo',
            title: 'Teste de título',
            isDraft: false,
            school: r.schools[0],
            status: true,
            user: r,
        }

        const result = await postService.create(post);

        expect(result).toHaveProperty('id');

    })

});

