import { createClient, SetOptions } from 'redis';
import { HelperService } from './helper.service';
import { ICacheService } from '../interfaces/cache.service.interface';
import { injectable } from 'tsyringe';

@injectable()
export class CacheService implements ICacheService {
  private client: any;

  async createClient() {
    const { REDIS_HOST, REDIS_PORT } = await HelperService.getSSMEnvironments();

    this.client = createClient({
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT || 6379,
      },
    });
  }

  async connect() {
    await this.createClient();
    await this.client.connect();
  }

  async disconnect() {
    await this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    await this.connect();
    const value = await this.client.get(key);
    await this.disconnect();
    return value;
  }

  async set(
    key: string,
    value: any,
    opts: SetOptions | undefined = undefined,
  ): Promise<void> {
    await this.connect();
    await this.client.set(key, value, opts);
    await this.disconnect();
  }
}
