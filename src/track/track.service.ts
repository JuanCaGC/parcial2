import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class TrackService {

    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,

        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async create(albumId: string, track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion <= 0) {
            throw new BusinessLogicException("duracion of more than 0 are required for the track", BusinessError.BAD_REQUEST);
        }

        const associatedAlbum: AlbumEntity = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!associatedAlbum) {
            throw new BusinessLogicException("The associated album does not exist", BusinessError.BAD_REQUEST);
        }
        track.album = associatedAlbum;
        return await this.trackRepository.save(track);
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["album"] } );
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
   
        return track;
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["album"] });
    }
}
