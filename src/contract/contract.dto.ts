export class CreateContractDto {
  auction_id: string;
  provider_id: string;
  requester_id: string;
  agreed_price: number;
  start_date: Date;
  end_date: Date;
  status: string;
}

export class ContractResponseDto extends CreateContractDto {
  contract_id: string;
}

export class ContractListResponseDto {
  items: ContractResponseDto[];
}
