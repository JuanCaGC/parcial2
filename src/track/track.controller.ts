/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { TrackService } from './track.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { Body, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TrackDto } from './track.dto';
import { TrackEntity } from './track.entity';
import { plainToInstance } from 'class-transformer';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}
  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':trackId')
  async findOne(@Param('trackId') trackId: string) {
    return await this.trackService.findOne(trackId);
  }

  @Post()
  async create(@Param('albumId') albumId: string, @Body() trackDto: TrackDto) 
  {
    const track: TrackEntity = plainToInstance(TrackEntity, trackDto)
    return await this.trackService.create(albumId, track);
  }

}
