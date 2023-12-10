export function handlerTemplate(className: string, moduleName: string): string {
  const controllerName = `${className}Controller`;

  const template = `
    import 'reflect-metadata';

    import { ${controllerName} } from '@modules/${moduleName}/implementations/${moduleName}.controller';
    import { EContentTypeEnum } from '@modules/http/enums/headers.enum';
    import { BaseHandlerService } from '@modules/http/implementations/base-handler.service';
    
    const handler = new BaseHandlerService();

    export const create = handler.defaultHandler(${controllerName}, 'create', EContentTypeEnum.JSON);
    export const findAll = handler.defaultHandler(${controllerName}, 'findAll', EContentTypeEnum.JSON);
    export const findOne = handler.defaultHandler(${controllerName}, 'findOne', EContentTypeEnum.JSON);
    export const update = handler.defaultHandler(${controllerName}, 'update', EContentTypeEnum.JSON);
    export const remove = handler.defaultHandler(${controllerName}, 'remove', EContentTypeEnum.JSON);
    `;

  return template;
}
