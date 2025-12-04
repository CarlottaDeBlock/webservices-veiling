import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateLotDto,
  LotDetailResponseDto,
  LotListResponseDto,
  LotResponseDto,
} from './lot.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq, InferSelectModel, and } from 'drizzle-orm';
import { bids, lots, userFavoriteLots, users } from '../drizzle/schema';
import { BidWithUserResponseDto } from '../bid/bid.dto';

type BidRow = InferSelectModel<typeof bids> & {
  bidder: InferSelectModel<typeof users>;
};

@Injectable()
export class LotService {
  async getAll(): Promise<LotListResponseDto> {
    const rows = await this.db.query.lots.findMany({
      with: {
        requester: true,
        winner: true,
      },
    });

    const items: LotResponseDto[] = rows.map((row) => ({
      lotId: row.lotId,
      requestId: row.requestId,
      requesterId: row.requesterId,
      title: row.title,
      description: row.description,
      startTime: row.startTime,
      endTime: row.endTime,
      winnerId: row.winnerId,
      category: row.category,
      reservedPrice: row.reservedPrice,
      buyPrice: row.buyPrice,
      startBid: row.startBid,
      status: row.status,
      extraInformation: row.extraInformation,
      isReversed: row.isReversed === 1,
      canBidHigher: row.canBidHigher === 1,
      createdAt: row.createdAt,
    }));

    return { items };
  }

  async getById(id: number): Promise<LotDetailResponseDto> {
    const lot = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, id),
      with: {
        bids: {
          with: {
            bidder: true,
          },
        },
      },
    });

    if (!lot) {
      throw new NotFoundException('Lot not found');
    }

    const bidsWithUser: BidWithUserResponseDto[] = (lot.bids as BidRow[]).map(
      (b) => ({
        bidId: b.bidId,
        amount: b.amount,
        bidTime: b.bidTime,
        bidder: {
          userId: b.bidder.userId,
          username: b.bidder.username,
        },
      }),
    );

    return {
      lotId: lot.lotId,
      requestId: lot.requestId,
      requesterId: lot.requesterId,
      title: lot.title,
      description: lot.description,
      startTime: lot.startTime,
      endTime: lot.endTime,
      winnerId: lot.winnerId,
      category: lot.category,
      reservedPrice: lot.reservedPrice,
      buyPrice: lot.buyPrice,
      startBid: lot.startBid,
      status: lot.status,
      extraInformation: lot.extraInformation,
      isReversed: lot.isReversed === 1,
      canBidHigher: lot.canBidHigher === 1,
      createdAt: lot.createdAt,
      bids: bidsWithUser,
    };
  }

  async create(data: CreateLotDto): Promise<LotResponseDto> {
    const [inserted] = await this.db
      .insert(lots)
      .values({
        requestId: data.requestId,
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        winnerId: data.winnerId,
        category: data.category,
        reservedPrice: data.reservedPrice,
        buyPrice: data.buyPrice,
        startBid: data.startBid,
        status: data.status,
        extraInformation: data.extraInformation,
        isReversed: data.isReversed ? 1 : 0,
        canBidHigher: data.canBidHigher ? 1 : 0,
      })
      .$returningId();

    return this.getById(inserted.lotId);
  }

  async updateById(id: number, data: CreateLotDto): Promise<LotResponseDto> {
    await this.db
      .update(lots)
      .set({
        requestId: data.requestId,
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        winnerId: data.winnerId,
        category: data.category,
        reservedPrice: data.reservedPrice,
        buyPrice: data.buyPrice,
        startBid: data.startBid,
        status: data.status,
        extraInformation: data.extraInformation,
        isReversed: data.isReversed ? 1 : 0,
        canBidHigher: data.canBidHigher ? 1 : 0,
      })
      .where(eq(lots.lotId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(lots).where(eq(lots.lotId, id));
    if (result.affectedRows === 0) throw new NotFoundException('Lot not found');
  }

  async getFavoriteLotsByUserId(userId: number): Promise<LotResponseDto[]> {
    const favorites = await this.db.query.userFavoriteLots.findMany({
      where: eq(userFavoriteLots.userId, userId),
      with: { lot: true },
    });

    return favorites.map((fav) => ({
      lotId: fav.lot.lotId,
      requestId: fav.lot.requestId,
      requesterId: fav.lot.requesterId,
      title: fav.lot.title,
      description: fav.lot.description,
      startTime: fav.lot.startTime,
      endTime: fav.lot.endTime,
      winnerId: fav.lot.winnerId,
      category: fav.lot.category,
      reservedPrice: fav.lot.reservedPrice,
      buyPrice: fav.lot.buyPrice,
      startBid: fav.lot.startBid,
      status: fav.lot.status,
      extraInformation: fav.lot.extraInformation,
      isReversed: fav.lot.isReversed === 1,
      canBidHigher: fav.lot.canBidHigher === 1,
      createdAt: fav.lot.createdAt,
    }));
  }

  async addFavoriteLot(userId: number, lotId: number): Promise<void> {
    await this.db
      .insert(userFavoriteLots)
      .values({ userId, lotId })
      .onDuplicateKeyUpdate({ set: {} });
  }

  async removeFavoriteLot(userId: number, lotId: number): Promise<void> {
    await this.db
      .delete(userFavoriteLots)
      .where(
        and(
          eq(userFavoriteLots.userId, userId),
          eq(userFavoriteLots.lotId, lotId),
        ),
      );
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
