import {IsNotEmpty, IsString, IsDate} from 'class-validator';
export class AlbumDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly caratula: string;

    @IsString()
    @IsNotEmpty()
    readonly fechaLanzamiento: string;

    @IsString()

    readonly descripcion: string;
}
