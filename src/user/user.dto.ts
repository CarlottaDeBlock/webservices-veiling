export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  isProvider: boolean;
  rating: number | null;
  companyId: number | null;
  role: string;
  language: string;
}

export class UserResponseDto extends CreateUserDto {
  userId: number;
  createdAt: Date;
}

export class UserListResponseDto {
  items: UserResponseDto[];
}
