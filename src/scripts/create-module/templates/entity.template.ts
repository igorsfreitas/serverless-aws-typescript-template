export const entityInterfaceTemplate = (className: string): string => {
  const interfaceName = `I${className}Entity`;
  const template = `export interface ${interfaceName} {}`;

  return template;
};

export const entityTemplate = (
  className: string,
  moduleName: string,
): string => {
  const interfaceName = `I${className}Entity`;
  const entityName = `${className}Entity`;

  const template = `
        import { injectable } from 'tsyringe';
        import { ${interfaceName} } from '../interfaces/${moduleName}.entity.interface';
      
        @injectable()
        export class ${entityName} implements ${interfaceName} {}
      `;

  return template;
};
