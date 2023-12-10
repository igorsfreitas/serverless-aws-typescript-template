import { HelperService } from '@modules/shared/services/helper.service';

export function unitTestServiceTemplate(
  className: string,
  moduleName: string,
): string {
  const serviceName = `${className}Service `;

  const template = `
    import { ${serviceName} } from '@modules/${moduleName}/implementations/${moduleName}.service';

    describe(${serviceName}.name, () => {
      let service: ${serviceName};
    
      beforeEach(() => {
        service = new ${serviceName}();
        // inject mock dependences here
      });
    
      it('should be defined', () => {
        expect(service).toBeDefined();
      });
    });
  `;

  return template;
}

export function serviceInterfaceTemplate(
  className: string,
  moduleName: string,
): string {
  const interfaceName = `I${className}Service`;
  const createDtoName = `Create${className}Dto`;
  const createDtoNameParam =
    HelperService.firstLetterToLowerCase(createDtoName);
  const updateDtoName = `Update${className}Dto`;
  const updateDtoNameParam =
    HelperService.firstLetterToLowerCase(updateDtoName);

  const template = `
      import { ${createDtoName} } from '../dtos/create-${moduleName}.dto';
      import { ${updateDtoName} } from '../dtos/update-${moduleName}.dto';
  
      export interface ${interfaceName} {
         create(${createDtoNameParam}: ${createDtoName}): any;
         findAll(): any;
         findOne(id: number): any;
         update(id: number, ${updateDtoNameParam}: ${updateDtoName}): any;
         remove(id: number): any;
      }
    `;

  return template;
}

export function serviceTemplate(className: string, moduleName: string): string {
  const serviceName = `${className}Service`;
  const implementationServiceClassName = `I${serviceName}`;
  const createDtoName = `Create${className}Dto`;
  const updateDtoName = `Update${className}Dto`;
  const createDtoLetterToLowerCaseName =
    HelperService.firstLetterToLowerCase(createDtoName);
  const updateDtoLetterToLowerCaseName =
    HelperService.firstLetterToLowerCase(updateDtoName);

  const template = `
      import { injectable } from 'tsyringe';
      import { ${implementationServiceClassName} } from '../interfaces/${moduleName}.service.interface';
      import { ${createDtoName} } from '../dtos/create-${moduleName}.dto';
      import { ${updateDtoName} } from '../dtos/update-${moduleName}.dto';
  
      @injectable()
      export class ${serviceName} implements ${implementationServiceClassName} {
  
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        create(_${createDtoLetterToLowerCaseName}: ${createDtoName}) {
          const message = 'This action adds a new data';
      
          return message;
        }
  
        findAll() {
          const message = 'This action returns all data';
      
          return message;
        }
  
        findOne(id: number) {
          const message = \`This action returns a #\${id} data\`;
      
          return message;
        }
  
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        update(id: number, _${updateDtoLetterToLowerCaseName}: ${updateDtoName} ) {
          const message = \`This action updates a #\${id} data\`;
      
          return message;
        }
  
        remove(id: number) {
          const message = \`This action remove a #\${id} data\`;
      
          return message;
        }
      }
    `;

  return template;
}

export function serviceMockedTemplate(className: string, moduleName: string) {
  const serviceInterfaceName = `I${className}Service`;
  const serviceName = HelperService.firstLetterToLowerCase(className);

  const template = `
      import { ${serviceInterfaceName} } from '@modules/${moduleName}/interfaces/${moduleName}.service.interface';
  
      export const ${serviceName}Mock: jest.Mocked<${serviceInterfaceName}> = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      };
    `;

  return template;
}
