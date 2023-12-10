import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ClassValidatorExampleStub {
  @Expose()
  @IsNotEmpty()
  public field1: string;

  @Expose()
  @IsNotEmpty()
  public field2: string;
}
