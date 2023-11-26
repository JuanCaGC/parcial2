import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerService } from './performer.service';
import { PerformerEntity } from './performer.entity';
import { faker } from '@faker-js/faker';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await repository.save({
          nombre: faker.lorem.word(),
          imagen: faker.image.url(),
          descripcion: faker.lorem.word()})
        performerList.push(performer);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.lorem.word(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.word(),
      albums: []
    }
    
 
    const newPerformer: PerformerEntity = await service.create(performer);
    expect(newPerformer).not.toBeNull();
 
    const storedPerformer: PerformerEntity = await repository.findOne({where: {id: newPerformer.id}})
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.nombre).toEqual(newPerformer.nombre)
    expect(storedPerformer.imagen).toEqual(newPerformer.imagen)
    expect(storedPerformer.descripcion).toEqual(newPerformer.descripcion)
  });

  it('create should throw an exception for an invalid performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.lorem.word(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.paragraphs(3),
      albums: []
    }
    await expect(() => service.create(performer)).rejects.toHaveProperty("message", "A descripcion of less than 100 characters are required for the performer")
  });

  it('findAll should return all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performerList.length);
  });

  it('findOne should return a performer by id', async () => {
    const storedPerformer: PerformerEntity = performerList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre)
    expect(performer.imagen).toEqual(storedPerformer.imagen)
    expect(performer.descripcion).toEqual(storedPerformer.descripcion)
  });

  it('findOne should throw an exception for an invalid performer', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The performer with the given id was not found")
  });
});
