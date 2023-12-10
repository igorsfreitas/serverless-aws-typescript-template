import { BadRequestResponseDto } from '../dtos/bad-request.dto';
import { ConflictResponseDto } from '../dtos/conflict.dto';
import { ForbiddenResponseDto } from '../dtos/forbidden.dto';
import { NotFoundResponseDto } from '../dtos/not-found.dto';
import { UnauthorizedResponseDto } from '../dtos/unauthorized.dto';
import { EStatusCodeType } from '../enums/status-code.enum';

export const badRequestResponseExample: BadRequestResponseDto = {
  statusCode: EStatusCodeType.BAD_REQUEST,
  messages: ['string'],
  error: 'Bad Request',
};

export const notFoundResponseExample: NotFoundResponseDto = {
  statusCode: EStatusCodeType.NOT_FOUND,
  messages: ['string'],
  error: 'Not Found',
};

export const unauthorizedResponseExample: UnauthorizedResponseDto = {
  statusCode: EStatusCodeType.UNAUTHORIZED,
  messages: ['string'],
  error: 'Not Found',
};

export const forbiddenResponseExample: ForbiddenResponseDto = {
  statusCode: EStatusCodeType.FORBIDDEN,
  messages: ['string'],
  error: 'Forbidden',
};

export const conflictResponseExample: ConflictResponseDto = {
  statusCode: EStatusCodeType.CONFLICT,
  messages: ['string'],
  error: 'Not Found',
};
