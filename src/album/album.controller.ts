/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AlbumService } from './album.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { Body, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AlbumDto } from './album.dto';
import { AlbumEntity } from './album.entity';
import { plainToInstance } from 'class-transformer';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Get()
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':albumId')
  async findOne(@Param('albumId') albumId: string) {
    return await this.albumService.findOne(albumId);
  }

  @Post()
  async create(@Body() albumDto: AlbumDto) 
  {
    const album: AlbumEntity = plainToInstance(AlbumEntity, albumDto)
    album.fechaLanzamiento = new Date(album.fechaLanzamiento);
    return await this.albumService.create(album);
  }

  @Delete(':albumId')
  @HttpCode(204)
  async delete(@Param('albumId') albumId: string) {
    return await this.albumService.delete(albumId);
  }
}
