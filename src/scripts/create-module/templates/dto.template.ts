export const updateDtoTemplate = (className: string): string => {
  const dtoName = `Update${className}Dto`;
  const template = `export class ${dtoName} {}`;

  return template;
};

export const createDtoTemplate = (className: string): string => {
  const dtoName = `Create${className}Dto`;
  const template = `export class ${dtoName} {}`;

  return template;
};
