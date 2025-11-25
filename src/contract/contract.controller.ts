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
  getAll(): ContractListResponseDto {
    return this.contractService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): ContractResponseDto {
    return this.contractService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createContractDto: CreateContractDto): ContractResponseDto {
    return this.contractService.create(createContractDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: CreateContractDto,
  ): ContractResponseDto {
    return this.contractService.updateById(id, updateContractDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.contractService.deleteById(id);
  }
}
