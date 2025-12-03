import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
} from './contract.dto';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async getAll(): Promise<ContractListResponseDto> {
    return this.contractService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<ContractResponseDto> {
    return this.contractService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.create(createContractDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.updateById(id, updateContractDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.contractService.deleteById(id);
  }
}
