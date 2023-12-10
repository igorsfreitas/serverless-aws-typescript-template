export function functionImportTemplate(moduleName: string): string {
  // eslint-disable-next-line no-template-curly-in-string
  const template = '- ${file(./serverless/functions/$1.yml)} \n'.replace(
    '$1',
    moduleName,
  );

  return template;
}

export function functionTemplate(
  className: string,
  moduleName: string,
): string {
  const content = `
    create${className}:
      handler: src/handlers/${moduleName}/index.create
      events:
        - http:
            path: /${moduleName}
            method: POST
    findAll${className}:
      handler: src/handlers/${moduleName}/index.findAll
      events:
        - http:
            path: /${moduleName}
            method: GET
    findOne${className}:
      handler: src/handlers/${moduleName}/index.findOne
      events:
        - http:
            path: /${moduleName}/{id}
            method: GET
    update${className}:
      handler: src/handlers/${moduleName}/index.update
      events:
        - http:
            path: /${moduleName}/{id}
            method: PATCH
    remove${className}:
      handler: src/handlers/${moduleName}/index.remove
      events:
        - http:
            path: /${moduleName}/{id}
            method: DELETE\n`;

  return content;
}
