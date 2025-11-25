export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  is_provider: boolean;
  rating: number;
  company_id: string;
  phonenumber: string;
  role: string;
  language: string;
}

export class UserResponseDto extends CreateUserDto {
  user_id: string;
  created_at: Date;
}

export class UserListResponseDto {
  items: UserResponseDto[];
}
