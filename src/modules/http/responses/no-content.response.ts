import { EStatusCodeType } from '../enums/status-code.enum';
import { HttpResponse } from './http-response.service';

export class NoContentResponse extends HttpResponse {
  constructor(public readonly message?: string) {
    super(
      null,
      EStatusCodeType.NO_CONTENT,
      message || 'Nenhum conteúdo retornado',
      0,
    );
  }
}
