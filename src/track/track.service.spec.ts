import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { faker } from '@faker-js/faker';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
