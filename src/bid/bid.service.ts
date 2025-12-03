import { Injectable, NotFoundException } from '@nestjs/common';
import { BidListResponseDto, BidResponseDto, CreateBidDto } from './bid.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { bids } from '../drizzle/schema';

@Injectable()
export class BidService {
  async getAll(): Promise<BidListResponseDto> {
    const items = await this.db.query.bids.findMany();
    return { items };
  }

  async getByAuction(auctionId: number): Promise<BidListResponseDto> {
    const items = await this.db.query.bids.findMany({
      where: eq(bids.auctionId, auctionId),
    });
    return { items };
  }

  async getById(bidId: number): Promise<BidResponseDto> {
    const bid = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, bidId),
    });
    if (!bid) throw new NotFoundException('Bid not found');
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

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
