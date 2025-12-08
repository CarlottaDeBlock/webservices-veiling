import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from './user.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema';

@Injectable()
export class UserService {
  private mapRow(row: typeof users.$inferSelect): UserResponseDto {
    return {
      userId: row.userId,
      username: row.username,
      email: row.email,
      password: row.password,
      // tinyint(0/1) → boolean
      isProvider: row.isProvider === 1,
      rating: row.rating,
      companyId: row.companyId,
      role: row.role,
      language: row.language,
      createdAt: row.createdAt,
    };
  }

  async getAll(): Promise<UserListResponseDto> {
    const rows = await this.db.query.users.findMany({
      with: {
        company: true,
      },
    });
    const items = rows.map((row) => this.mapRow(row));
    return { items };
  }

  async getById(id: number): Promise<UserResponseDto> {
    const row = await this.db.query.users.findFirst({
      where: eq(users.userId, id),
      with: {
        company: true,
        bids: true,
        lotsRequested: true,
        lotsWon: true,
        contractsAsProvider: true,
        reviewsWritten: true,
        reviewsReceived: true,
      },
    });

    if (!row) {
      throw new NotFoundException({
        message: 'User not found',
        details: { id },
      });
    }

    return this.mapRow(row);
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const [inserted] = await this.db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        password: data.password,
        // boolean → tinyint
        isProvider: data.isProvider ? 1 : 0,
        rating: data.rating,
        companyId: data.companyId,
        role: data.role,
        language: data.language,
      })
      .$returningId();

    return this.getById(inserted.userId);
  }

  async updateById(id: number, data: CreateUserDto): Promise<UserResponseDto> {
    await this.db
      .update(users)
      .set({
        username: data.username,
        email: data.email,
        password: data.password,
        isProvider: data.isProvider ? 1 : 0,
        rating: data.rating,
        companyId: data.companyId,
        role: data.role,
        language: data.language,
      })
      .where(eq(users.userId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(users).where(eq(users.userId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'User not found',
        details: { id },
      });
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
