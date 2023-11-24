import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from './performer.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PerformerService {

    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>
    ){}

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        if (performer.descripcion.length > 100) {
            throw new BusinessLogicException("A descripcion of less than 100 characters are required for the performer", BusinessError.BAD_REQUEST);
        }
        return await this.performerRepository.save(performer);
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id}, relations: ["albums"] } );
        if (!performer)
          throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
   
        return performer;
    }

    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({ relations: ["albums"] });
    }

}
