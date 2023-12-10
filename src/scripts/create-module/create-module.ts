import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  entityInterfaceTemplate,
  entityTemplate,
} from './templates/entity.template';
import { createDtoTemplate, updateDtoTemplate } from './templates/dto.template';
import {
  serviceInterfaceTemplate,
  serviceMockedTemplate,
  serviceTemplate,
  unitTestServiceTemplate,
} from './templates/service.template';
import {
  controllerInterfaceTemplate,
  controllerTemplate,
  unitTestControllerTemplate,
} from './templates/controller.template';
import { handlerTemplate } from './templates/handler.template';
import {
  functionImportTemplate,
  functionTemplate,
} from './templates/serverless.template';

const moduleNameParameter = process.argv[2]; // Nome do módulo passado como parâmetro
const moduleName = moduleNameParameter
  ?.replace(/([a-z])([A-Z])/g, '$1-$2')
  .toLowerCase();
let className = moduleName
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

// Dirs
const serverlessDir = path.join('serverless');
const moduleDir = path.join('src', 'modules', moduleName);
const dtosDir = path.join(moduleDir, 'dtos');
const entityDir = path.join(moduleDir, 'entities');
const controllerImplementationDir = path.join(moduleDir, 'implementations');
const interfaceDir = path.join(moduleDir, 'interfaces');
const handlerDir = path.join('src', 'handlers', `${moduleName}`);
const unitTestDir = path.join('tests', 'unit', 'modules', `${moduleName}`);
const unitTestMockDir = path.join(unitTestDir, 'mocks');
const containerServiceDir = path.join(
  'src',
  'infrastructure',
  'containers',
  'services.container.ts',
);

// Make sure the first character is uppercase
className = className.charAt(0).toUpperCase() + className.slice(1);

const writeFiles = () => {
  // Create create dto file
  fs.writeFileSync(
    path.join(dtosDir, `create-${moduleName}.dto.ts`),
    createDtoTemplate(className),
  );

  // Create update dto file
  fs.writeFileSync(
    path.join(dtosDir, `update-${moduleName}.dto.ts`),
    updateDtoTemplate(className),
  );

  // Create entities file
  fs.writeFileSync(
    path.join(interfaceDir, `${moduleName}.entity.interface.ts`),
    entityInterfaceTemplate(className),
  );

  // Create entities implementatiom file
  fs.writeFileSync(
    path.join(entityDir, `${moduleName}.entity.ts`),
    entityTemplate(className, moduleName),
  );

  // Create service file implementation
  fs.writeFileSync(
    path.join(controllerImplementationDir, `${moduleName}.service.ts`),
    serviceTemplate(className, moduleName),
  );

  // Create service
  fs.writeFileSync(
    path.join(interfaceDir, `${moduleName}.service.interface.ts`),
    serviceInterfaceTemplate(className, moduleName),
  );

  // Create controller file implementation
  fs.writeFileSync(
    path.join(controllerImplementationDir, `${moduleName}.controller.ts`),
    controllerTemplate(className, moduleName),
  );

  // Create controller file
  fs.writeFileSync(
    path.join(interfaceDir, `${moduleName}.controller.interface.ts`),
    controllerInterfaceTemplate(className),
  );

  // Create handler file
  fs.writeFileSync(
    path.join(handlerDir, `index.ts`),
    handlerTemplate(className, moduleName),
  );

  // Create mock service unit test file
  fs.writeFileSync(
    path.join(unitTestMockDir, `${moduleName}.service.mock.ts`),
    serviceMockedTemplate(className, moduleName),
  );

  // Create controller unit test file
  fs.writeFileSync(
    path.join(unitTestDir, `${moduleName}.controller.spec.ts`),
    unitTestControllerTemplate(className, moduleName),
  );

  // Create controllere unit test file
  fs.writeFileSync(
    path.join(unitTestDir, `${moduleName}.service.spec.ts`),
    unitTestServiceTemplate(className, moduleName),
  );

  // Create yml file
  fs.writeFileSync(
    path.join(serverlessDir, 'functions', `${moduleName}.yml`),
    functionTemplate(className, moduleName),
  );
};

// Create dirs(folders)
const writeDirs = () => {
  fs.mkdirSync(moduleDir);
  fs.mkdirSync(dtosDir);
  fs.mkdirSync(entityDir);
  fs.mkdirSync(interfaceDir);
  fs.mkdirSync(controllerImplementationDir);
  fs.mkdirSync(handlerDir);
  fs.mkdirSync(unitTestDir);
  fs.mkdirSync(unitTestMockDir);
};

// Add new routeReplace in serverlessFunctions.yml
const writeServerlessYmlFunctions = () => {
  const filePath = path.join(serverlessDir, 'functions.yml');
  const newRoute = functionImportTemplate(moduleName);
  // read file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    // get content + new route
    const updatedContent = data + newRoute;

    // write file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        throw err;
      }
    });
  });
};

// Format new files
const formatFiles = () => {
  try {
    execSync(`npx prettier --write ${moduleDir}`, {
      stdio: 'inherit',
    });

    execSync(`npx prettier --write ${handlerDir}`, {
      stdio: 'inherit',
    });

    execSync(`npx prettier --write ${containerServiceDir}`, {
      stdio: 'inherit',
    });

    execSync(`npx prettier --write ${unitTestDir}`, {
      stdio: 'inherit',
    });

    execSync(`npx prettier --write ${serverlessDir}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    throw error;
  }
};

const modifyContainerFile = () => {
  const serviceName = `${className}Service`;
  const implementationServiceName = `I${className}Service`;

  const serviceRegistration = `container.registerSingleton<${implementationServiceName}>(${serviceName}.name, ${serviceName});`;
  const serviceImports = `
    import { ${implementationServiceName} } from '@modules/${moduleName}/interfaces/${moduleName}.service.interface';
    import { ${serviceName} } from '@modules/${moduleName}/implementations/${moduleName}.service';
  `;

  const updatedContainerContent = fs
    .readFileSync(containerServiceDir, 'utf8')
    .replace(
      `import { container } from 'tsyringe'`,
      `${serviceImports}import { container } from 'tsyringe'`,
    )
    .replace(
      `export { container };`,
      `${serviceRegistration} export { container };`,
    );

  fs.writeFileSync(containerServiceDir, updatedContainerContent, 'utf8');
};

try {
  writeDirs();
  writeFiles();
  writeServerlessYmlFunctions();
  modifyContainerFile();
  formatFiles();
  console.log(`successfully implemented ${moduleName} route`); // eslint-disable-line no-console
  console.log('files formated on Prettier.'); // eslint-disable-line no-console
} catch (error) {
  console.error(`Error - ${moduleName} route:`, error); // eslint-disable-line no-console
}
