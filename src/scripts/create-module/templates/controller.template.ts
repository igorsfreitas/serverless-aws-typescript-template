import { HelperService } from '@modules/shared/services/helper.service';

export const controllerInterfaceTemplate = (className: string): string => {
  const controllerClassName = `I${className}Controller`;
  const template = `
      import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
  
      export interface ${controllerClassName} {
         create(request: IHttpRequest): any;
         findAll(request: IHttpRequest): any;
         findOne(request: IHttpRequest): any;
         update(request: IHttpRequest): any;
         remove(request: IHttpRequest): any;
      }
    `;

  return template;
};

export function controllerTemplate(
  className: string,
  moduleName: string,
): string {
  const controllerClassName = `${className}Controller`;
  const serviceName = `${className}Service`;
  const implementationServiceClassName = `I${serviceName}`;
  const createDtoName = `Create${className}Dto`;
  const updateDtoName = `Update${className}Dto`;
  const serviceNameToLowerCaseName =
    HelperService.firstLetterToLowerCase(serviceName);
  const createDtoLetterToLowerCaseName =
    HelperService.firstLetterToLowerCase(createDtoName);
  const updateDtoLetterToLowerCaseName =
    HelperService.firstLetterToLowerCase(updateDtoName);

  const template = `
      import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
      import { inject, injectable } from 'tsyringe';
      import { Delete, Get, Patch, Post } from '@decorators/methods.decorator';
      import { ERequestType } from '@decorators/enum/request-validation.enum';
      import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
      import { Validation } from '@decorators/request-validation.decorator';
      import { HttpStatusCode } from '@decorators/http-status-code.decorator';
      import { ${serviceName} } from './${moduleName}.service';
      import { I${controllerClassName} } from '../interfaces/${moduleName}.controller.interface';
      import { ${implementationServiceClassName} } from '../interfaces/${moduleName}.service.interface';
      import { ${createDtoName} } from '../dtos/create-${moduleName}.dto';
      import { ${updateDtoName} } from '../dtos/update-${moduleName}.dto';
  
    
      @injectable()
      export class ${controllerClassName} implements I${className}Controller {
      constructor(
        @inject(${serviceName}.name)
        private readonly ${serviceNameToLowerCaseName}: ${implementationServiceClassName},
      ) {}
  
      @Validation(${createDtoName}, ERequestType.BODY, { whitelist: true })
      @HttpStatusCode(EStatusCodeType.CREATED)
      @Post()
      create(request: IHttpRequest) {
        const ${createDtoLetterToLowerCaseName}: ${createDtoName}= request.body;
        const response = this.${serviceNameToLowerCaseName}.create(${createDtoLetterToLowerCaseName});
  
        return response;
      }
  
      @Get()
      findAll() {
        const response = this.${serviceNameToLowerCaseName}.findAll();
  
        return response;
      }
  
      @Get(':id')
      findOne(request: IHttpRequest) {
        const { id } = request.pathParameters as { id: string };
        const response = this.${serviceNameToLowerCaseName}.findOne(+id);
  
        return response;
      }
  
      @Validation(${updateDtoName}, ERequestType.BODY, { whitelist: true })
      @Patch(':id')
      update(request: IHttpRequest) {
        const { id } = request.pathParameters as { id: string };
        const ${updateDtoLetterToLowerCaseName}: ${updateDtoName}= request.body;
        
        const response = this.${serviceNameToLowerCaseName}.update(+id, ${updateDtoLetterToLowerCaseName});
  
        return response;
      }
  
      @Delete(':id')
      remove(request: IHttpRequest) {
        const { id } = request.pathParameters as { id: string };
        
        const response = this.${serviceNameToLowerCaseName}.remove(+id);
  
        return response;
      }
    }
  `;

  return template;
}

export function unitTestControllerTemplate(
  className: string,
  moduleName: string,
): string {
  const controllerName = `${className}Controller`;
  const serviceMock = `${HelperService.firstLetterToLowerCase(className)}Mock`;

  const template = `
    import { ${controllerName} } from '@modules/${moduleName}/implementations/${moduleName}.controller';
    import { ${serviceMock} } from './mocks/${moduleName}.service.mock';
  
    describe(${controllerName}.name, () => {
      let controller: ${controllerName};
    
      beforeEach(() => {
        controller = new ${controllerName}(${serviceMock});
      });
    
      it('should be defined', () => {
        expect(controller).toBeDefined();
      });
    });
  
  `;

  return template;
}
