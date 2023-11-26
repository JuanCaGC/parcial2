import { PerformerEntity } from '../performer/performer.entity';
import { TrackEntity } from '../track/track.entity';
import { Column, Entity, JoinTable, OneToMany, ManyToMany,PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlbumEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;
 @Column()
 nombre: string;
 
 @Column()
 caratula: string;
 
 @Column()
 fechaLanzamiento: Date;
 
 @Column()
 descripcion: string;

 @OneToMany(() => TrackEntity, track => track.album)
 @JoinTable()
 tracks: TrackEntity[];

 @ManyToMany(() => PerformerEntity, performer => performer.albums)
 @JoinTable()
 performers: PerformerEntity[];
}