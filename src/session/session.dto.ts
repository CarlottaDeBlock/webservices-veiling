import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'nestjs-swagger-dto';
import { IsEmail } from 'class-validator';

export class LoginRequestDto {
  @IsString({
    name: 'email',
    example: 'user@email.com',
  })
  @IsEmail()
  email: string;

  @IsString({ name: 'password', minLength: 8, maxLength: 128 })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT token for authentication' })
  token: string;
}
