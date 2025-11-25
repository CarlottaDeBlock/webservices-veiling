import { Injectable, NotFoundException } from '@nestjs/common';
import { USERS, User } from '../data/mock_data';
import {
  CreateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from './user.dto';

@Injectable()
export class UserService {
  getAll(): UserListResponseDto {
    return { items: USERS };
  }

  getById(id: string): UserResponseDto {
    const user = USERS.find((u) => u.user_id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  create(data: CreateUserDto): UserResponseDto {
    const newUser: User = {
      ...data,
      user_id: String(Date.now()),
      created_at: new Date(),
    };
    USERS.push(newUser);
    return newUser;
  }

  updateById(id: string, data: CreateUserDto): UserResponseDto {
    const index = USERS.findIndex((u) => u.user_id === id);
    if (index === -1) throw new NotFoundException('User not found');
    USERS[index] = { ...USERS[index], ...data };
    return USERS[index];
  }

  deleteById(id: string): void {
    const index = USERS.findIndex((u) => u.user_id === id);
    if (index === -1) throw new NotFoundException('User not found');
    USERS.splice(index, 1);
  }
}
