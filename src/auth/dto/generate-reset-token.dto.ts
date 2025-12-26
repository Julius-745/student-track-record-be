import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GenerateResetTokenDto {
  @ApiProperty({ description: 'User ID to generate reset token for' })
  @IsUUID()
  userId: string;
}
