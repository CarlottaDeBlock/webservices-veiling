import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'nestjs-swagger-dto';
import { IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { CreateCompanyDto } from '../company/company.dto';

// Volledige user (intern, voor admin/own profile)
export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;

  @ApiProperty({
    example: 'provider1',
    description: 'Username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'provider1@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user is a provider',
  })
  isProvider: boolean;

  @ApiProperty({
    example: 4.5,
    description: 'Average rating of the provider (1–5)',
    nullable: true,
  })
  rating: number | null;

  @ApiProperty({
    example: 2,
    description: 'ID of the company the user belongs to',
    nullable: true,
  })
  companyId: number | null;

  @ApiProperty({
    example: 'provider',
    description: 'Primary role of the user',
  })
  role: string;

  @ApiProperty({
    example: 'nl',
    description: 'Preferred language code',
  })
  language: string;

  @ApiProperty({
    example: ['USER', 'PROVIDER'],
    description: 'Roles assigned to the user',
    isArray: true,
  })
  roles: string[];

  @ApiProperty({
    example: '2025-09-12T08:55:15.039Z',
    description: 'Creation timestamp of the user',
  })
  createdAt: Date;
}

// Publieke subset
export class PublicUserResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'ID of the user' })
  userId: number;

  @Expose()
  @ApiProperty({
    example: 'provider1',
    description: 'Username of the user',
  })
  username: string;

  @Expose()
  @ApiProperty({
    example: 'provider1@example.com',
    description: 'Email of the user',
  })
  email: string;
}

export class PublicUserListResponseDto {
  @ApiProperty({ type: () => [PublicUserResponseDto] })
  items: PublicUserResponseDto[];
}

// Register request
export class RegisterUserRequestDto {
  @IsString({
    name: 'username',
    description: 'Username of the user',
    minLength: 2,
    maxLength: 100,
  })
  @ApiProperty({
    example: 'provider1',
    description: 'Username of the user',
    minLength: 2,
    maxLength: 100,
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'provider1@example.com',
    description: 'Email of the user',
  })
  email: string;

  @IsString({
    name: 'password',
    description: 'Password of the user',
    minLength: 8,
    maxLength: 128,
  })
  @ApiProperty({
    example: '12345678',
    description: 'Password (min 8 characters)',
    minLength: 8,
    maxLength: 128,
  })
  password: string;

  @IsBoolean({
    name: 'isProvider',
    description: 'Whether the user registers as provider',
  })
  @ApiProperty({
    example: true,
    description: 'Whether the user registers as provider',
  })
  isProvider: boolean;

  @IsString({
    name: 'language',
    description: 'Preferred language code',
    maxLength: 10,
  })
  @ApiProperty({
    example: 'nl',
    description: 'Preferred language code',
    maxLength: 10,
  })
  language: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  @ApiProperty({
    description: 'Optional company to create for this provider',
    required: false,
    type: () => CreateCompanyDto,
    nullable: true,
  })
  company?: CreateCompanyDto;
}

// Update request
export class UpdateUserRequestDto {
  @IsString({
    name: 'username',
    description: 'Username of the user',
    minLength: 2,
    maxLength: 100,
  })
  @ApiProperty({
    example: 'provider1',
    description: 'Updated username',
    minLength: 2,
    maxLength: 100,
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'provider1@example.com',
    description: 'Updated email address',
  })
  email: string;
}
