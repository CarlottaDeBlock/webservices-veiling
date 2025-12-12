import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import { and, eq, desc } from 'drizzle-orm';
import { bids, lots, auctions } from '../drizzle/schema';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';

@Injectable()
export class BidService {
  async getAll(session: Session): Promise<BidListResponseDto> {
    const isAdmin = session.roles.includes(Role.ADMIN);
    const rows = await this.db.query.bids.findMany({
      where: isAdmin ? undefined : eq(bids.bidderId, session.id),
      columns: {
        bidId: true,
        lotId: true,
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
    const items: BidResponseDto[] = rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));
    return { items };
  }

  async getByAuction(auctionId: number): Promise<BidListResponseDto> {
    const rows = await this.db.query.bids.findMany({
      where: eq(bids.auctionId, auctionId),
      with: {
        bidder: true,
      },
    });
    const items: BidResponseDto[] = rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));
    return { items };
  }

  async getByLot(lotId: number): Promise<BidListResponseDto> {
    const rows = await this.db.query.bids.findMany({
      where: eq(bids.lotId, lotId),
      with: {
        bidder: true,
      },
    });
    const items: BidResponseDto[] = rows.map((row) => ({
      ...row,
      amount: Number(row.amount),
    }));
    return { items };
  }

  async getById(bidId: number, session: Session): Promise<BidResponseDto> {
    const row = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, bidId),
      with: {
        bidder: true,
        auction: true,
      },
    });
    if (!row) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { bidId },
      });
    }
    const isOwner = row.bidderId === session.id;
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { bidId },
      });
    }
    const bid: BidResponseDto = {
      ...row,
      amount: Number(row.amount),
    };
    return bid;
  }

  async create(data: CreateBidDto, session: Session): Promise<BidResponseDto> {
    const lot = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, data.lotId),
    });
    if (!lot) {
      throw new NotFoundException({
        message: 'Lot not found',
        details: { lotId: data.lotId },
      });
    }

    if (lot.status !== 'open') {
      throw new BadRequestException({
        message: 'Lot is not open for bidding',
        details: { lotId: data.lotId },
      });
    }

    const auctionId = data.auctionId ?? lot.auctionId;
    const auction = await this.db.query.auctions.findFirst({
      where: eq(auctions.auctionId, auctionId),
    });
    if (!auction) {
      throw new NotFoundException({
        message: 'Auction not found',
        details: { auctionId },
      });
    }

    const lastBid = await this.db.query.bids.findFirst({
      where: eq(bids.lotId, data.lotId),
      orderBy: (b) => desc(b.bidTime),
    });

    const minAllowed = lastBid
      ? Number(lastBid.amount)
      : Number(lot.startBid ?? 0);

    if (data.amount <= minAllowed) {
      throw new BadRequestException({
        message: 'Amount is below minimum or last bid',
        details: {
          body: { amount: ['Amount must be greater than current bid'] },
        },
      });
    }

    const [inserted] = await this.db
      .insert(bids)
      .values({
        auctionId,
        lotId: data.lotId,
        bidderId: session.id,
        amount: data.amount.toString(),
        bidTime: new Date(),
      })
      .$returningId();

    const row = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, inserted.bidId),
      with: {
        bidder: true,
        auction: true,
      },
    });

    if (!row) {
      throw new Error('Failed to load created bid');
    }
    const bid: BidResponseDto = {
      ...row,
      amount: Number(row.amount),
    };
    return bid;
  }

  async updateById(
    id: number,
    dto: UpdateBidDto,
    session: Session,
  ): Promise<BidResponseDto> {
    const existing = await this.db.query.bids.findFirst({
      where: eq(bids.bidId, id),
    });
    if (!existing) {
      throw new NotFoundException({
        message: 'Bid not found',
        details: { id },
      });
    }
    const isOwner = existing.bidderId === session.id;
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
        amount: dto.amount.toString(),
        auctionId: dto.auctionId,
        lotId: dto.lotId,
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
        message: 'Bid not found (missing)',
        details: { id },
      });
    }
    const isOwner = bid.bidderId === session.id;
    const isAdmin = session.roles.includes(Role.ADMIN);
    if (!isOwner && !isAdmin) {
      throw new NotFoundException({
        message: 'Bid not found (forbidden)',
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
