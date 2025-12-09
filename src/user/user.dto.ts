import {
  IsString,
  /*IsNotEmpty,*/
  MaxLength,
  IsEmail,
  IsBoolean,
  /*IsArray,
  ArrayNotEmpty,*/
  MinLength,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CreateCompanyDto } from '../company/company.dto';

/*export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(255)
  password: string;

  @IsBoolean()
  isProvider: boolean;

  @IsOptional()
  rating: number | null;

  @IsOptional()
  companyId: number | null;

  @IsString()
  role: string;

  @IsString()
  language: string;

  @IsArray()
  @ArrayNotEmpty()
  roles: string[];
}*/

export class UserResponseDto {
  userId: number;
  username: string;
  email: string;
  isProvider: boolean;
  rating: number | null;
  companyId: number | null;
  role: string;
  language: string;
  roles: string[];
  createdAt: Date;
}

export class PublicUserResponseDto {
  @Expose()
  userId: number;

  @Expose()
  username: string;

  @Expose()
  email: string;
}

export class PublicUserListResponseDto {
  items: PublicUserResponseDto[];
}

export class RegisterUserRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsBoolean()
  isProvider: boolean;

  @IsString()
  @MaxLength(10)
  language: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company?: CreateCompanyDto;
}

export class UpdateUserRequestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @IsString()
  @IsEmail()
  email: string;
}
