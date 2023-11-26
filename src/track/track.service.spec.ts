import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackService } from './track.service';
import { TrackEntity } from './track.entity';
import { AlbumEntity } from '../album/album.entity';
import { faker } from '@faker-js/faker';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let trackList: TrackEntity[];
  let albumT: AlbumEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumRepository.clear();
    trackList = [];
    for(let i = 0; i < 5; i++){
        const track: TrackEntity = await repository.save({
          nombre: faker.lorem.word(),
          duracion: faker.number.int({ min: 1 })})
        trackList.push(track);
    }
    albumT = await albumRepository.save({
      nombre: faker.lorem.word(),
        caratula: faker.lorem.sentence(),
        fechaLanzamiento: faker.date.anytime(),
        descripcion: faker.lorem.sentence(),
        tracks: trackList
    })
    
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new track', async () => {

    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: faker.number.int({ min: 1 }),
      album: null
    }
 
    const newTrack: TrackEntity = await service.create(albumT.id, track);
    expect(newTrack).not.toBeNull();
 
    const storedTrack: TrackEntity = await repository.findOne({where: {id: newTrack.id}})
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(newTrack.nombre)
    expect(storedTrack.duracion).toEqual(newTrack.duracion)

  });

  it('create should throw an exception for an invalid track', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: 0,
      album: null
    }
    await expect(() => service.create(albumT.id,track)).rejects.toHaveProperty("message", "duracion of more than 0 are required for the track")
  });

  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(trackList.length);
  });

  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = trackList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre)
    expect(track.duracion).toEqual(storedTrack.duracion)

  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The track with the given id was not found")
  });

});
