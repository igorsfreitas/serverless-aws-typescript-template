import { SetOptions } from 'redis';

export interface ICacheService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: any, opts: SetOptions | undefined): Promise<void>;
}
