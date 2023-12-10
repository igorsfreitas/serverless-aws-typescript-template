import { TestMockEntity } from '@tests/unit/modules/shared/repositories/mocks/dynamodb.repository.mock';

export const testEntityStub: Promise<TestMockEntity[]> = Promise.resolve([
  {
    id: '95a99cf0-518d-11ee-be56-0242ac120002',
    nome: 'teste',
    secondaryId: 'ab3d4a62-518d-11ee-be56-0242ac120002',
  },
]);
