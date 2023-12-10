import 'reflect-metadata';

import { DeleteScheduleController } from '@modules/delete-schedule/implementations/delete-schedule.controller';
import { BaseHandlerService } from '@modules/http/implementations/base-handler.service';
import { EContentTypeEnum } from '@modules/http/enums/headers.enum';

const handler = new BaseHandlerService();

export const findOne = handler.defaultHandler(
  DeleteScheduleController,
  'findOne',
  EContentTypeEnum.JSON,
);
export const update = handler.defaultHandler(
  DeleteScheduleController,
  'update',
  EContentTypeEnum.JSON,
);
export const remove = handler.defaultHandler(
  DeleteScheduleController,
  'remove',
  EContentTypeEnum.JSON,
);
export const teste = handler.defaultHandler(
  DeleteScheduleController,
  'teste',
  EContentTypeEnum.JSON,
);
