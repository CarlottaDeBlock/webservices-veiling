export interface User {
  user_id: string;
  username: string;
  email: string;
  password: string;
  is_provider: boolean;
  rating: number;
  company_id: string;
  phonenumber: string;
  role: string;
  language: string;
  created_at: Date;
}

export interface Company {
  company_id: string;
  name: string;
  vat_number: string;
  address: string;
  city: string;
  country: string;
  status: string;
  peppol_id: string;
  created_at: Date;
  invoice_email: string;
}

export interface Auction {
  auction_id: string;
  request_id: string;
  start_time: Date;
  end_time: Date;
  status: string;
  category: string;
  created_at: Date;
}

export interface Lot {
  lot_id: string;
  request_id: string;
  requester_id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  winner_id: string | null;
  category: string;
  reserved_price: number;
  buy_price: number;
  start_bid: number;
  created_at: Date;
  status: string;
  extra_information?: string;
  is_reversed: boolean;
  can_bid_higher: boolean;
}

export interface Bid {
  bid_id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  bid_time: Date;
}

export interface Contract {
  contract_id: string;
  auction_id: string;
  provider_id: string;
  requester_id: string;
  agreed_price: number;
  start_date: Date;
  end_date: Date;
  status: string;
}

export interface Invoice {
  invoice_id: string;
  contract_id: string;
  amount: number;
  issue_date: Date;
  due_date: Date;
  status: string;
}

export interface Review {
  review_id: string;
  contract_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string;
  created_at: Date;
}

export const USERS: User[] = [
  {
    user_id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'hashedpw',
    is_provider: false,
    rating: 4.7,
    company_id: '1',
    phonenumber: '0612345678',
    role: 'requester',
    language: 'nl',
    created_at: new Date(),
  },
  {
    user_id: '2',
    username: 'provider1',
    email: 'provider1@example.com',
    password: 'hashedpw2',
    is_provider: true,
    rating: 4.8,
    company_id: '2',
    phonenumber: '0622222222',
    role: 'provider',
    language: 'en',
    created_at: new Date(),
  },
  {
    user_id: '3',
    username: 'requester2',
    email: 'requester2@example.com',
    password: 'hashedpw3',
    is_provider: false,
    rating: 4.2,
    company_id: '1',
    phonenumber: '0633333333',
    role: 'requester',
    language: 'nl',
    created_at: new Date(),
  },
];

export const LOTS: Lot[] = [
  {
    lot_id: '1',
    request_id: '101',
    requester_id: '1',
    title: 'Laptop',
    description: 'Nieuwe laptop',
    start_time: new Date(),
    end_time: new Date(),
    winner_id: '2',
    category: 'electronics',
    reserved_price: 200,
    buy_price: 300,
    start_bid: 150,
    created_at: new Date(),
    status: 'open',
    extra_information: '',
    is_reversed: false,
    can_bid_higher: true,
  },
  {
    lot_id: '2',
    request_id: '102',
    requester_id: '3',
    title: 'Transport pallets',
    description: '20 pallets EU transport',
    start_time: new Date(),
    end_time: new Date(Date.now() + 1000 * 60 * 90),
    winner_id: null,
    category: 'logistics',
    reserved_price: 800,
    buy_price: 1200,
    start_bid: 600,
    created_at: new Date(),
    status: 'open',
    extra_information: '',
    is_reversed: true,
    can_bid_higher: true,
  },
];

export const AUCTIONS: Auction[] = [
  {
    auction_id: '1',
    request_id: '101',
    start_time: new Date(),
    end_time: new Date(),
    status: 'open',
    created_at: new Date(),
    category: 'electronics',
  },
  {
    auction_id: '2',
    request_id: '102',
    start_time: new Date(),
    end_time: new Date(Date.now() + 1000 * 60 * 120),
    status: 'open',
    created_at: new Date(),
    category: 'logistics',
  },
  {
    auction_id: '3',
    request_id: '103',
    start_time: new Date(Date.now() - 1000 * 60 * 60),
    end_time: new Date(),
    status: 'closed',
    created_at: new Date(),
    category: 'it-services',
  },
];

export const BIDS: Bid[] = [
  {
    bid_id: '1',
    auction_id: '1',
    bidder_id: '2',
    amount: 220,
    bid_time: new Date(),
  },
  {
    bid_id: '2',
    auction_id: '1',
    bidder_id: '2',
    amount: 2300,
    bid_time: new Date(),
  },
  {
    bid_id: '3',
    auction_id: '2',
    bidder_id: '2',
    amount: 900,
    bid_time: new Date(),
  },
];

export const COMPANIES: Company[] = [
  {
    company_id: '1',
    name: 'AuctionCorp',
    vat_number: 'NL123456789B01',
    address: 'Example street 1',
    city: 'Amsterdam',
    country: 'Netherlands',
    status: 'active',
    peppol_id: 'NL:12345',
    created_at: new Date(),
    invoice_email: 'invoice@auctioncorp.com',
  },
  {
    company_id: '2',
    name: 'RequestCo',
    vat_number: 'NL111111111B01',
    address: 'Requesterstraat 1',
    city: 'Amsterdam',
    country: 'Netherlands',
    status: 'active',
    peppol_id: 'NL:REQ1',
    created_at: new Date(),
    invoice_email: 'finance@requestco.com',
  },
  {
    company_id: '3',
    name: 'ProviderCorp',
    vat_number: 'NL222222222B01',
    address: 'Providerlaan 10',
    city: 'Rotterdam',
    country: 'Netherlands',
    status: 'active',
    peppol_id: 'NL:PROV1',
    created_at: new Date(),
    invoice_email: 'billing@providercorp.com',
  },
];

export const CONTRACTS: Contract[] = [
  {
    contract_id: '1',
    auction_id: '1',
    provider_id: '2',
    requester_id: '1',
    agreed_price: 220,
    start_date: new Date(),
    end_date: new Date(),
    status: 'active',
  },
  {
    contract_id: '2',
    auction_id: '3',
    provider_id: '2',
    requester_id: '3',
    agreed_price: 1500,
    start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    end_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: 'completed',
  },
];

export const INVOICES: Invoice[] = [
  {
    invoice_id: '1',
    contract_id: '1',
    amount: 2300,
    issue_date: new Date(),
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    status: 'unpaid',
  },
  {
    invoice_id: '2',
    contract_id: '2',
    amount: 1500,
    issue_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    due_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: 'paid',
  },
];

export const REVIEWS: Review[] = [
  {
    review_id: '1',
    contract_id: '2',
    reviewer_id: '3',
    reviewed_user_id: '2',
    rating: 5,
    comment: 'Perfect collaboration',
    created_at: new Date(),
  },
  {
    review_id: '2',
    contract_id: '1',
    reviewer_id: '1',
    reviewed_user_id: '2',
    rating: 4,
    comment: 'Good, small delay in delivery',
    created_at: new Date(),
  },
];
