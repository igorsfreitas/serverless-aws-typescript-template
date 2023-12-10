import { BadRequestError } from '@modules/errors/bad-request-error.service';
import * as crypto from 'crypto';
import { HelperService } from './helper.service';
import { inject, injectable } from 'tsyringe';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';
import { CacheService } from './cache.service';
import { ICacheService } from '../interfaces/cache.service.interface';
import { ICryptographyService } from '../interfaces/cryptography.service.interface';

@injectable()
export class CryptographyService implements ICryptographyService {
  private readonly encoding: BufferEncoding = 'hex';

  private readonly VALID_PATTERN =
    /^[0-9a-f]{16}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[0-9a-f]{4}$/;

  private readonly EXPIRES_IN_1_MONTH = 60 * 60 * 24 * 30;

  constructor(
    @inject(LoggerService.name)
    public readonly loggerService: ILoggerService,
    @inject(CacheService.name)
    public readonly cacheService: ICacheService,
  ) {}

  /**
   * @description Generates a random secret key of a specific size.
   * @param keySize - The size of the key in bytes.
   * @returns A hexadecimal string representing the secret key.
   */
  secretKeyGenerate(keySize: number) {
    // Generate a random key using the 'crypto' module
    const secretKey = crypto.randomBytes(keySize);

    // Converts the key to a hexadecimal representation
    const secretKeyString = secretKey.toString('hex');

    return secretKeyString;
  }

  /**
   * @description Encrypts a string using the AES-256-CBC algorithm.
   * @param str - The string to be encrypted.
   * @returns A hexadecimal string representing the encrypted string.
   * @throws BadRequestError BadRequestError if encryption failed.
   */
  async encrypt(str: string, secretKey: string): Promise<string> {
    try {
      // Generates a random initialization vector (IV)
      const iv = crypto.randomBytes(16);
      // Creates a cipher object using the AES-256-CBC algorithm
      const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);

      // Criptografa a string de entrada e concatena o resultado
      const encrypted = Buffer.concat([
        cipher.update(str, 'utf-8'),
        cipher.final(),
      ]);

      // Combines the IV and encrypted data into a single hexadecimal string
      const response =
        iv.toString(this.encoding) + encrypted.toString(this.encoding);

      return response;
    } catch (error) {
      this.loggerService.error('-- encryption failure', error);

      throw new BadRequestError('encryption failure');
    }
  }

  /**
   * @description Decrypts a previously encrypted string using the AES-256-CBC algorithm.
   * @param str - The encrypted string.
   * @returns The decrypted Payload.
   */
  async decrypt(str: string, secretKey: string): Promise<unknown> {
    try {
      // Splits encrypted string into IV and encrypted data
      const { encryptedDataString, ivString } = {
        ivString: str.slice(0, 32),
        encryptedDataString: str.slice(32),
      };

      // Converts IV and encrypted data from hexadecimal strings to buffers
      const iv = Buffer.from(ivString, this.encoding);
      const encryptedText = Buffer.from(encryptedDataString, this.encoding);
      // Creates a decryption object using the AES-256-CBC algorithm
      const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
      // Decrypts the data
      const decrypted = decipher.update(encryptedText);
      // Converts decrypted data to JSON
      const response = Buffer.concat([decrypted, decipher.final()]).toString();

      const parser = HelperService.isJsonString(response);

      return parser || response;
    } catch (error) {
      this.loggerService.error('-- decrypt failure', error);

      throw new BadRequestError('decrypt failure');
    }
  }

  /**
   * @description Verify signature hmac and validate encrypted payload
   * @param str - The encrypted string.
   * @returns The decrypted Payload.
   */
  verifySignature = async (
    hmac: string,
    hmacTimestamp: string,
    dataEncrypted: string,
  ): Promise<void> => {
    const {
      COREAPP_RSA_PRIVATE,
      COREAPP_RSA_SECRET,
      COREAPP_AES_REQUEST_SECRET_KEY,
    } = await HelperService.getSSMEnvironments();

    const formatPrivateKey = COREAPP_RSA_PRIVATE.replace(/\\n/g, '\n'); // replace line break

    const [payload, hmacEnconded] = hmac.split('|');

    const decryptedHMAC = crypto
      .privateDecrypt(
        {
          key: formatPrivateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(hmacEnconded, 'base64'),
      )
      .toString('hex');

    const decryptHmacTimestamp = (await this.decrypt(
      hmacTimestamp,
      COREAPP_AES_REQUEST_SECRET_KEY,
    )) as string;

    const createdHmac = crypto
      .createHmac('sha256', COREAPP_RSA_SECRET)
      .update(dataEncrypted + decryptHmacTimestamp)
      .digest('hex');

    if (createdHmac !== decryptedHMAC) {
      throw new BadRequestError('Hash Inválido');
    }

    const currentTimestamp = new Date().toISOString();

    const diff = Math.abs(
      new Date(currentTimestamp).getTime() -
        new Date(decryptHmacTimestamp).getTime(),
    );

    if (diff > 600000) {
      throw new BadRequestError('Hash Expirado');
    }

    const decryptPayload = await this.decrypt(
      payload,
      COREAPP_AES_REQUEST_SECRET_KEY,
    );

    const decryptData = await this.decrypt(
      dataEncrypted,
      COREAPP_AES_REQUEST_SECRET_KEY,
    );

    if (JSON.stringify(decryptPayload) !== JSON.stringify(decryptData)) {
      throw new BadRequestError('Hash Inválido');
    }
  };

  /**
   * @description Calculates the sum for the uuid.
   * @param str - Token UUID.
   * @returns The total calculated.
   */
  private calculateChecksum = (uuid: string): string => {
    let sum = 0;
    const cleanedUuid = uuid.replace(/-/g, '');
    for (const item of cleanedUuid) {
      sum += parseInt(item, 16);
    }
    return (sum % 65536).toString(16).padStart(4, '0');
  };

  /**
   * @description Validates the x-validate-token
   * @param str - Token.
   * @returns Boolean reather if the token is valid or not.
   */
  validateXToken = async (uuid: string): Promise<boolean> => {
    this.loggerService.info(`uuid: ${uuid}`);

    if (uuid.length !== 49 || !this.VALID_PATTERN.test(uuid)) {
      return false;
    }

    const isUUID = await this.cacheService.get(uuid);

    this.loggerService.info(`isUUiD: ${isUUID}`);
    if (isUUID) return false;

    const checksum = uuid.substring(45);
    this.loggerService.info(`checksum: ${checksum}`);

    const partialUuid = uuid.substring(0, 45);
    this.loggerService.info(`partialUuid: ${partialUuid}`);

    if (this.calculateChecksum(partialUuid) === checksum) {
      await this.cacheService.set(uuid, '0', { EX: this.EXPIRES_IN_1_MONTH });

      return true;
    }

    return false;
  };
}
