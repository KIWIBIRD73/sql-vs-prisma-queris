import { Test, TestingModule } from '@nestjs/testing';
import { InitializeDbService } from './initialize-db.service';

describe('InitializeDbService', () => {
  let service: InitializeDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitializeDbService],
    }).compile();

    service = module.get<InitializeDbService>(InitializeDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
