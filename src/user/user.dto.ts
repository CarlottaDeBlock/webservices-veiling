import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
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
}

export class UserResponseDto extends CreateUserDto {
  userId: number;
  createdAt: Date;
}

export class PublicUserResponseDto {
  userId: number;
  username: string;
}

export class UserListResponseDto {
  items: UserResponseDto[];
}
