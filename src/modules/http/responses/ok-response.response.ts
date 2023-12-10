import { EStatusCodeType } from '../enums/status-code.enum';
import { HttpResponse } from './http-response.service';

export class OkResponse extends HttpResponse {
  constructor(
    public readonly data: any,
    public readonly message: string = 'Sucesso',
  ) {
    super(data, EStatusCodeType.OK, message, 0);
  }
}
