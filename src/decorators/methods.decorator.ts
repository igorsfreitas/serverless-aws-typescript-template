import 'reflect-metadata';
import { ERequestMethod } from './enum/request-validation.enum';
import { HTTP_METHOD_KEY, ROUTER_KEY } from './constants/metadata.constants';

export function NoHttp() {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_METHOD_KEY,
      ERequestMethod.NO_HTTP,
      target,
      propertyKey,
    );
  };
}

export function Get(route?: string) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_METHOD_KEY,
      ERequestMethod.GET,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(ROUTER_KEY, route || '', target, propertyKey);
  };
}

export function Post(route?: string) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_METHOD_KEY,
      ERequestMethod.POST,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(ROUTER_KEY, route || '', target, propertyKey);
  };
}

export function Patch(route?: string) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_METHOD_KEY,
      ERequestMethod.PATCH,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(ROUTER_KEY, route || '', target, propertyKey);
  };
}

export function Delete(route?: string) {
  return function (
    target: any,
    propertyKey: string,
    _descriptor: PropertyDescriptor, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    Reflect.defineMetadata(
      HTTP_METHOD_KEY,
      ERequestMethod.DELETE,
      target,
      propertyKey,
    );
    Reflect.defineMetadata(ROUTER_KEY, route || '', target, propertyKey);
  };
}
