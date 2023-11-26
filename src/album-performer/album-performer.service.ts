import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class AlbumPerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({ where: {id: albumId} });
        const performer: PerformerEntity = await this.performerRepository.findOne({ where: { id: performerId } });

        if (!album) {
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (!performer) {
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (album.performers && album.performers.length >= 3) {
            throw new BusinessLogicException("The album cannot have more than three performers", BusinessError.BAD_REQUEST);
        }
        if (album.performers){
            album.performers = [...album.performers, performer];}
        else{
            album.performers = [performer];}
        return await this.albumRepository.save(album);
    }
}
