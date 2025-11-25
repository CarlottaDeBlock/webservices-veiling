import { Injectable, NotFoundException } from '@nestjs/common';
import { BIDS } from '../data/mock_data';
import { BidListResponseDto, BidResponseDto, CreateBidDto } from './bid.dto';

@Injectable()
export class BidService {
  getAll(): BidListResponseDto {
    return { items: BIDS };
  }

  getByAuction(auctionId: string): BidListResponseDto {
    const bids = BIDS.filter((bid) => bid.auction_id === auctionId);
    return { items: bids };
  }

  getById(bidId: string): BidResponseDto {
    const bid = BIDS.find((b) => b.bid_id === bidId);
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  create(data: CreateBidDto): BidResponseDto {
    const newBid = {
      ...data,
      bid_id: String(Date.now()),
      bid_time: new Date(),
    };
    BIDS.push(newBid);
    return newBid;
  }
}
