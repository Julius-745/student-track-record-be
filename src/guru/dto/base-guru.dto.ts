import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseGuruDto {
    @ApiProperty({ example: '199501012024051001' })
    @IsString()
    @IsNotEmpty()
    nip: string;

    @ApiProperty({ example: 'Cory' })
    @IsString()
    @IsNotEmpty()
    nama: string;

    @ApiProperty({ example: 'Guru Mapel' })
    @IsString()
    @IsNotEmpty()
    posisi: string;

    @ApiProperty({ example: 'email' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'guru' })
    @IsString()
    @IsNotEmpty()
    role: string;

}   