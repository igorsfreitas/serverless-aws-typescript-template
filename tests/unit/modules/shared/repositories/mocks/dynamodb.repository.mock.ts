import { Column, Entity } from '@decorators/dynamo-db.decorator';
import { injectable } from 'tsyringe';

@Entity('test-dynamodb-entity')
@injectable()
export class TestMockEntity {
  @Column({ primaryKey: true })
  public id: string;

  public nome: string;

  @Column({ primaryKey: true })
  public secondaryId: string;
}

export const queryMock = jest.fn();
export const scanMock = jest.fn();
export const putMock = jest.fn();
export const updateMock = jest.fn();
