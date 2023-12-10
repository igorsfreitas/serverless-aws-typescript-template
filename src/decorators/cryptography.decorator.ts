import { IS_CRYPTOGRAPHY_KEY } from './constants/metadata.constants';

export function IsCryptography() {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(IS_CRYPTOGRAPHY_KEY, true, target, propertyKey);
  };
}

export function checkIsCryptography(
  instance: any,
  functionName: string,
): boolean {
  return (
    Reflect.getMetadata(IS_CRYPTOGRAPHY_KEY, instance, functionName) || false
  );
}
