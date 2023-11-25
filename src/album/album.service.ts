import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.nombre || !album.descripcion) {
            throw new BusinessLogicException("nombre and descripcion are required for create the album", BusinessError.BAD_REQUEST);
        }
        return await this.albumRepository.save(album);
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["tracks", "performers"] } )
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
        return album;
    }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["tracks", "performers"] })
    }

    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
 
        if (album.tracks && album.tracks.length > 0) {
            throw new BusinessLogicException("The album cannot be deleted as it has associated tracks", BusinessError.BAD_REQUEST);
        }
     
        await this.albumRepository.remove(album);
    }
}
