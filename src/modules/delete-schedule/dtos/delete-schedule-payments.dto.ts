import {
  IsString,
  IsNotEmpty,
  IsDate,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';

class Conta {
  @IsNotEmpty()
  agencia: number;

  @IsNotEmpty()
  conta: number;
}
export class DeleteSchedulePaymentDto {
  @IsString()
  @IsOptional()
  documento?: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @ValidateNested()
  conta: Conta;

  @IsDate()
  data: Date;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  idTed: string;
}
