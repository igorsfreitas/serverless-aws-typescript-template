import { ValidationError, validate } from 'class-validator';
import { ERequestType } from './enum/request-validation.enum';
import { plainToClass } from 'class-transformer';
import { IRequestValidationOptions } from './interface/request-validation.interface';
import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
import { container } from 'tsyringe';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { BadRequestError } from '@modules/errors/bad-request-error.service';

function getErrorMessages(errors: ValidationError[]): string[] {
  let messages: string[] = [];

  errors.forEach((error) => {
    if (error.children && error.children.length > 0) {
      const childrenError = getErrorMessages(error.children);

      messages = [
        ...messages,
        ...childrenError.map((children) => `${error.property}.${children}`),
      ];
    }

    if (error?.constraints) {
      messages = [...messages, ...Object.values(error.constraints)];
    }
  });

  messages = [...new Set(messages)];

  return messages;
}

export function Validation<T>(
  ClassType: new (...args: any[]) => T,
  requestType: ERequestType,
  requestValidationOptions?: IRequestValidationOptions,
): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (event: IHttpRequest) {
      // get object for validation
      const eventObject = event[requestType] || {};

      const instance = plainToClass(ClassType, eventObject, {
        excludeExtraneousValues: requestValidationOptions?.whitelist,
      }) as T & object;

      // class validation
      const errors = await validate(instance);

      if (errors.length > 0) {
        const errorResponse = {
          statusCode: EStatusCodeType.BAD_REQUEST,
          messages: getErrorMessages(errors),
          error: 'Bad Request',
        };

        const logger = container.resolve(LoggerService);

        logger.error('-- class validator error:', errorResponse);

        throw new BadRequestError(errorResponse.messages);
      }

      if (requestValidationOptions?.whitelist) {
        event[requestType] = plainToClass(ClassType, eventObject, {
          excludeExtraneousValues: true,
        });
      }

      return originalMethod.apply(this, [event]);
    };

    return descriptor;
  };
}
