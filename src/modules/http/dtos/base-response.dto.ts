import { ApiProperty } from '@decorators/swagger.decorator';
import { IsEmpty } from 'class-validator';
import { EStatusCodeType } from '../enums/status-code.enum';

export class BaseResponseDto {
  @ApiProperty({
    description: 'Status code',
  })
  public statusCode: EStatusCodeType;

  @ApiProperty({
    description: 'Lista de erros',
  })
  @IsEmpty()
  public messages: string[];

  @ApiProperty({
    description: 'Nome do erro',
  })
  @IsEmpty()
  public error: string;
}
