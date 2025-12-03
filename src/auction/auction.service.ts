import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAuctionRequestDto,
  AuctionResponseDto,
  AuctionListResponseDto,
} from './auction.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { auctions } from '../drizzle/schema';

@Injectable()
export class AuctionService {
  async getAll(): Promise<AuctionListResponseDto> {
    const items = await this.db.query.auctions.findMany();
    return { items };
  }

  async getById(id: number): Promise<AuctionResponseDto> {
    const auction = await this.db.query.auctions.findFirst({
      where: eq(auctions.auctionId, id),
    });

    if (!auction) {
      throw new NotFoundException(`Auction with id ${id} not found`);
    }

    return auction;
  }

  async create(data: CreateAuctionRequestDto): Promise<AuctionResponseDto> {
    const [inserted] = await this.db
      .insert(auctions)
      .values({
        requestId: data.requestId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
      })
      .$returningId(); // geeft { auctionId: number }

    return this.getById(inserted.auctionId);
  }

  async updateById(
    id: number,
    data: CreateAuctionRequestDto,
  ): Promise<AuctionResponseDto> {
    await this.db
      .update(auctions)
      .set({
        requestId: data.requestId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
      })
      .where(eq(auctions.auctionId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(auctions)
      .where(eq(auctions.auctionId, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('Auction not found');
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
