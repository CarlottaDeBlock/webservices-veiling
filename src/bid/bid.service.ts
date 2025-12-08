import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BidListResponseDto,
  BidResponseDto,
  CreateBidDto,
  UpdateBidDto,
} from './bid.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { and, eq } from 'drizzle-orm';
import { bids } from '../drizzle/schema';

@Injectable()
export class BidService {
  async getAll(): Promise<BidListResponseDto> {
    const items = await this.db.query.bids.findMany({
      columns: {
        bidId: true,
        auctionId: true,
        bidderId: true,
        amount: true,
        bidTime: true,
      },
      with: {
        bidder: true,
        auction: true,
      },
    });
    return { items };
  }

  async getByAuction(auctionId: number): Promise<BidListResponseDto> {
    const items = await this.db.query.bids.findMany({
      where: eq(bids.auctionId, auctionId),
      with: {
        bidder: true,
      },
    });
    return { items };
  }

  async getById(bidId: number): Promise<BidResponseDto> {
    const bid = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, bidId),
      with: {
        bidder: true,
        auction: true,
      },
    });
    if (!bid) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { bidId },
      });
    }
    return bid;
  }

  async create(data: CreateBidDto): Promise<BidResponseDto> {
    const [inserted] = await this.db
      .insert(bids)
      .values({
        auctionId: data.auctionId,
        bidderId: data.bidderId,
        amount: data.amount,
        bidTime: new Date(),
      })
      .$returningId();
    const row = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, inserted.bidId),
    });

    if (!row) {
      throw new Error('Failed to load created bid');
    }
    return row;
  }

  async updateById(
    id: number,
    { amount, auctionId, bidderId }: UpdateBidDto,
  ): Promise<BidResponseDto> {
    await this.db
      .update(bids)
      .set({
        amount,
        auctionId,
      })
      .where(and(eq(bids.bidId, id), eq(bids.bidderId, bidderId)));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(bids).where(eq(bids.bidId, id));
    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
