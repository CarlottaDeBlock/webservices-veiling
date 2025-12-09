import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateUserRequestDto,
  PublicUserListResponseDto,
  PublicUserResponseDto,
} from './user.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { users } from '../drizzle/schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<PublicUserListResponseDto> {
    const rows = await this.db.query.users.findMany({
      with: {
        company: true,
      },
    });
    const items = rows.map((row) =>
      plainToInstance(PublicUserResponseDto, row, {
        excludeExtraneousValues: true,
      }),
    );
    return { items };
  }

  async getById(id: number): Promise<PublicUserResponseDto> {
    const user = await this.db.query.users.findFirst({
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

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        details: { id },
      });
    }

    return plainToInstance(PublicUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /*async create(data: CreateUserDto): Promise<PublicUserResponseDto> {
    const [inserted] = await this.db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash: 'TODO_HASH',
        // boolean → tinyint
        isProvider: data.isProvider ? 1 : 0,
        rating: data.rating,
        companyId: data.companyId,
        role: data.role,
        language: data.language,
        roles: data.roles,
      })
      .$returningId();

    const row = await this.db.query.users.findFirst({
      where: eq(users.userId, inserted.userId),
    });

    if (!row) {
      throw new NotFoundException('User not found after create');
    }

    return plainToInstance(PublicUserResponseDto, row, {
      excludeExtraneousValues: true,
    });
  }*/

  async updateById(
    id: number,
    data: UpdateUserRequestDto,
  ): Promise<PublicUserResponseDto> {
    await this.db
      .update(users)
      .set({
        username: data.username,
        email: data.email,
        /*isProvider: data.isProvider ? 1 : 0,
        rating: data.rating,
        companyId: data.companyId,
        role: data.role,
        language: data.language,
        roles: data.roles,*/
      })
      .where(eq(users.userId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(users).where(eq(users.userId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
