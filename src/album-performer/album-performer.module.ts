import { Module } from '@nestjs/common';
import { AlbumPerformerService } from './album-performer.service';
import { AlbumEntity } from 'src/album/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity])],
  providers: [AlbumPerformerService]
})
export class AlbumPerformerModule {}
