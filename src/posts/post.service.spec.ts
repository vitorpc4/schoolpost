import { IPost } from '@/entities/interfaces/posts.interface';
import { Post } from '../entities/models/post.entity';
import { PostsService } from '@/services/post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { log } from 'console';
import { Repository } from 'typeorm';
import { TypeUser } from '@/entities/models/userSchoolAssociation.entity';
import { MockType } from 'test/Mock/Type.Mock';

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  delete: jest.fn((entity) => entity),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnValue([]),
    getOne: jest.fn().mockReturnValue({}),
  })),
}));

describe('PostService', () => {
  let postService: PostsService;
  let repositoryMock: MockType<Repository<Post>>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    postService = moduleFixture.get<PostsService>(PostsService);
    repositoryMock = moduleFixture.get(getRepositoryToken(Post));
  });

  it('deve trazer um post', async () => {
    const id: number = 1;

    postService.findById = jest.fn().mockReturnValueOnce({
      id,
      title: 'Teste',
      content: 'Teste',
      isDraft: false,
      status: true,
      school: {
        id: '04c0dde30654419ab1f01007a2297027',
        name: 'Teste',
        status: true,
        users: [1],
        posts: [],
      },
      user: {
        id: 1,
        name: 'Teste',
        email: 'teste@gmail.com',
        admin: true,
      },
    });

    const result = await postService.findById(id);

    expect(result.id).toEqual(id);
  });

  it('deve trazer os posts por palavra chave', async () => {
    const page: number = 1;
    const limit: number = 10;
    const associateIds: number[] = [1];
    const search: string = 'Teste';

    postService.findPostByKeyWord = jest.fn().mockReturnValueOnce([
      {
        id: 1,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
      {
        id: 2,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
      {
        id: 3,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
    ]);

    const result = await postService.findPostByKeyWord(
      associateIds,
      search,
      limit,
      page,
    );

    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('deve trazer todos os rascunhos', async () => {
    const page: number = 1;
    const limit: number = 10;
    const associateIds: number[] = [1];

    postService.findDraftsByAssociationId = jest.fn().mockReturnValueOnce([
      {
        id: 1,
        title: 'Teste',
        content: 'Teste',
        isDraft: true,
        status: true,
      },
      {
        id: 2,
        title: 'Teste',
        content: 'Teste',
        isDraft: true,
        status: true,
      },
      {
        id: 3,
        title: 'Teste',
        content: 'Teste',
        isDraft: true,
        status: true,
      },
    ]);

    const result = await postService.findDraftsByAssociationId(
      associateIds,
      page,
      limit,
    );

    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('deve trazer todos os posts de uma escola', async () => {
    const page: number = 1;
    const limit: number = 10;
    const associateIds: number[] = [1];

    postService.findPostByAssociationId = jest.fn().mockReturnValueOnce([
      {
        id: 1,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
      {
        id: 2,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
      {
        id: 3,
        title: 'Teste',
        content: 'Teste',
        isDraft: false,
        status: true,
      },
    ]);

    const result = await postService.findPostByAssociationId(
      associateIds,
      page,
      limit,
    );

    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('Criação de post', async () => {
    const post: IPost = {
      title: 'Teste',
      content: 'TesteContent',
      isDraft: false,
      status: true,
      id: 1,
      userSchoolAssociation: {
        id: 1,
        status: true,
        typeUser: TypeUser.Professor,
        admin: true,
        school: {
          name: 'Teste',
          status: true,
        },
        user: {
          email: 'teste',
          password: 'teste',
          status: true,
          username: 'teste',
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    postService.create = jest.fn().mockReturnValueOnce({
      title: 'Teste',
      content: 'TesteContent',
      isDraft: false,
      status: true,
      userSchoolAssociation: {
        id: 1,
        status: true,
        typeUser: 'Professor',
        admin: true,
      },
      id: 1,
      createAt: new Date(),
      updateAt: new Date(),
    });

    const result = await postService.create(post);

    expect(result.title).toEqual(post.title);
  });

  it('Deve atualizar o post', async () => {
    const post: IPost = {
      title: 'TesteAtualiza',
      content: 'TesteContent',
      isDraft: false,
      status: true,
      id: 1,
      userSchoolAssociation: {
        id: 1,
        status: true,
        typeUser: TypeUser.Professor,
        admin: true,
        school: {
          id: 'acb91924-c9c6-4efa-9209-b6c86e144c80',
          status: true,
          name: 'Teste',
        },
        user: {
          email: 'teste',
          password: 'teste',
          status: true,
          username: 'teste',
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    postService.update = jest.fn().mockReturnValueOnce({
      title: 'TesteAtualiza',
      content: 'TesteContentAtualizada',
      isDraft: false,
      status: true,
      userSchoolAssociation: {
        id: 1,
        status: true,
        typeUser: 'Professor',
        admin: true,
      },
      id: 1,
      createAt: new Date(),
      updateAt: new Date(),
    });

    const result = await postService.update(post);

    expect(result.title).toEqual(post.title);
  });

  it('Deve deletar um post', async () => {
    const id: number = 1;

    postService.delete = jest.fn().mockReturnValueOnce(true);

    const result = await postService.delete(id);

    expect(result).toBeTruthy();
  });
});
