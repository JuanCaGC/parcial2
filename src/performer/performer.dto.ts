import {IsNotEmpty, IsString} from 'class-validator';
export class PerformerDto {
    @IsString()
    @IsNotEmpty()
    nombre : string;
    
    @IsString()
    @IsNotEmpty()
    imagen : string;
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
