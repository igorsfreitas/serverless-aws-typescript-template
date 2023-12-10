import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { HTTP_STATUS_CODE_KEY } from './constants/metadata.constants';

export function HttpStatusCode(statusCode: EStatusCodeType) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_STATUS_CODE_KEY,
      statusCode,
      target,
      propertyKey,
    );
  };
}

export function getHttpStatusCode(
  instance: any,
  functionName: string,
): EStatusCodeType {
  return (
    Reflect.getMetadata(HTTP_STATUS_CODE_KEY, instance, functionName) ||
    EStatusCodeType.OK
  );
}
