import { Test, TestingModule } from '@nestjs/testing';
import { AlbumPerformerService } from './album-performer.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity'; 

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let albumT: AlbumEntity;
  let performerList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    
    await seedDataBase();
  });

  const seedDataBase = async () => {
    albumRepository.clear();
    performerRepository.clear();

    performerList = [];
    for(let i = 0; i<5; i++){
      const performer: PerformerEntity = await performerRepository.save({
        nombre: faker.lorem.word(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.word()
      })
      performerList.push(performer)
    }

    albumT = await albumRepository.save({
      nombre: faker.lorem.word(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.anytime(),
      descripcion: faker.lorem.sentence()
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerToAlbum should add a performer to a album', async ()=> {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.word(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.word()
    });

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.word(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.anytime(),
      descripcion: faker.lorem.sentence(),
    })

    const result: AlbumEntity = await service.addPerformerToAlbum(newAlbum.id, newPerformer.id);

    expect(result).not.toBeNull();
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].nombre).toEqual(newPerformer.nombre);
    expect(result.performers[0].imagen).toEqual(newPerformer.imagen);
    expect(result.performers[0].descripcion).toEqual(newPerformer.descripcion);
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
      nombre: faker.lorem.word(),
      imagen: faker.image.url(),
      descripcion: faker.lorem.word()
    });

    await expect(() => service.addPerformerToAlbum("0", newPerformer.id)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('addPerformerAlbum should throw an exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.word(),
      caratula: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.anytime(),
      descripcion: faker.lorem.sentence()
    });

    await expect(() => service.addPerformerToAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message", "The performer with the given id was not found");
  });

});
