import { Test, TestingModule } from '@nestjs/testing';
import { UserSchoolAssociationController } from './controllers/association.controller';

describe('UserSchoolAssociationController', () => {
  let controller: UserSchoolAssociationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSchoolAssociationController],
    }).compile();

    controller = module.get<UserSchoolAssociationController>(UserSchoolAssociationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
