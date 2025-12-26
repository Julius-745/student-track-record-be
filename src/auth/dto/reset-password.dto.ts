import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token from email link' })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'New password (min 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
