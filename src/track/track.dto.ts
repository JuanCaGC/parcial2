import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class TrackDto {
    @IsString()
    @IsNotEmpty()
    nombre : string;
    
    @IsNumber()
    @IsNotEmpty()
    duracion  : number;
}
