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
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';

@Injectable()
export class BidService {
  async getAll(session: Session): Promise<BidListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    const items = await this.db.query.bids.findMany({
      where: isAdmin ? undefined : eq(bids.bidderId, session.id),
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

  async getById(bidId: number, session: Session): Promise<BidResponseDto> {
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
    const isOwner = bid.bidderId === session.id;
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { bidId },
      });
    }
    return bid;
  }

  async create(data: CreateBidDto, session: Session): Promise<BidResponseDto> {
    const [inserted] = await this.db
      .insert(bids)
      .values({
        auctionId: data.auctionId,
        bidderId: session.id,
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
    dto: UpdateBidDto,
    session: Session,
  ): Promise<BidResponseDto> {
    const bid = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, id),
    });
    if (!bid) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
    const isOwner = bid.bidderId === session.id;
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
    await this.db
      .update(bids)
      .set({
        amount: dto.amount,
        auctionId: dto.auctionId,
      })
      .where(and(eq(bids.bidId, id)));

    return this.getById(id, session);
  }

  async deleteById(id: number, session: Session): Promise<void> {
    const bid = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, id),
    });
    if (!bid) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
    const isOwner = bid.bidderId === session.id;
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
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
