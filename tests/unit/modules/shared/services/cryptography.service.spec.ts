import { CryptographyService } from '@modules/shared/services/cryptography.service';
import { cacheServiceMocked } from './mocks/cache.service.mock';
import { loggerServiceMocked } from './mocks/logger.service.mock';
import * as crypto from 'crypto';
import {
  bodyRequestStub,
  newXvalidateTokenStub,
  secretAESRequestKeyStub,
  secretAESResponseKeyStub,
} from './stubs/cryptography.service.stub';
import { HelperService } from '@modules/shared/services/helper.service';
import { generateRsakeys } from '@tests/utils/cryptography.utils';

describe(CryptographyService.name, () => {
  let cryptographyService: CryptographyService;
  let privateKey: string;
  let publicKey: string;

  beforeEach(async () => {
    cryptographyService = new CryptographyService(
      loggerServiceMocked,
      cacheServiceMocked,
    );

    const keys = await generateRsakeys();

    privateKey = keys.privateKey;
    publicKey = keys.publicKey;

    jest.spyOn(HelperService, 'getSSMEnvironments').mockResolvedValue({
      APP_DB_NAME: '',
      APP_DB_HOST: '',
      APP_DB_PASSWORD: '',
      APP_DB_PORT: 0,
      APP_DB_USER: '',
      COREAPP_AES_REQUEST_SECRET_KEY: secretAESRequestKeyStub,
      COREAPP_AES_RESPONSE_SECRET_KEY: '',
      COREAPP_RSA_PRIVATE: privateKey,
      COREAPP_RSA_SECRET: publicKey,
      REDIS_HOST: '',
      REDIS_PORT: 6379,
      ENABLE_CRYPTOGRAPHY: true,
    });

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(cryptographyService).toBeDefined();
  });

  describe('secretKeyGenerate', () => {
    it('should generate a secret key of the specified size', () => {
      const keySize = 32;
      const secretKey = cryptographyService.secretKeyGenerate(keySize);

      expect(secretKey.length).toBe(keySize * 2); // Because it's in hexadecimal
      expect(typeof secretKey).toBe('string');
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt a string successfully', async () => {
      const plaintext = 'Hello, World!';
      const encrypted = await cryptographyService.encrypt(
        plaintext,
        secretAESResponseKeyStub,
      );

      const decrypt = await cryptographyService.decrypt(
        encrypted,
        secretAESResponseKeyStub,
      );

      expect(plaintext).toBe(decrypt);
      expect(typeof encrypted).toBe('string');
    });

    it('should handle empty string during encryption', async () => {
      const plaintext = '';
      const encrypted = await cryptographyService.encrypt(
        plaintext,
        secretAESResponseKeyStub,
      );

      // Ensure that the encrypted string is not empty
      expect(encrypted).not.toBe('');
    });

    it('should handle decryption with wrong key', async () => {
      try {
        const plaintext = 'Hello, World!';
        const otherKey = 'b3f8e79ae07788cb86fe875dc8d9190c';

        const encrypted = await cryptographyService.encrypt(
          plaintext,
          secretAESResponseKeyStub,
        );

        await cryptographyService.decrypt(encrypted, otherKey);
      } catch (error) {
        // Ensure that an error is thrown during decryption with the wrong key
        expect(error.messages).toContain('decrypt failure');
      }
    });
  });

  describe('verifySignature', () => {
    it('should verify the signature successfully', async () => {
      const bodyRequestEncryption = await cryptographyService.encrypt(
        JSON.stringify(bodyRequestStub),
        secretAESRequestKeyStub,
      );
      const timestamp = new Date().toISOString();
      const hmacTimestamp = await cryptographyService.encrypt(
        timestamp,
        secretAESRequestKeyStub,
      );

      const xhmacHash = () => {
        try {
          const rsaPublicKey = publicKey;

          const hmac = crypto
            .createHmac('sha256', publicKey)
            .update(bodyRequestEncryption + timestamp)
            .digest('hex');

          const encrypted = crypto
            .publicEncrypt(
              {
                key: rsaPublicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
              },
              Buffer.from(hmac, 'hex'),
            )
            .toString('base64');

          const hmacSignature = `${bodyRequestEncryption}|${encrypted}`;

          return hmacSignature;
        } catch (error) {
          loggerServiceMocked.error('-- signature failure -- ', error);

          throw error;
        }
      };

      await expect(
        cryptographyService.verifySignature(
          xhmacHash(),
          hmacTimestamp,
          bodyRequestEncryption,
        ),
      ).resolves.toBeUndefined();
    });

    it('should throw BadRequestError on invalid hash', async () => {
      try {
        const bodyRequestEncryption = await cryptographyService.encrypt(
          JSON.stringify(bodyRequestStub),
          secretAESRequestKeyStub,
        );
        const timestamp = new Date().toISOString();
        const hmacTimestamp = await cryptographyService.encrypt(
          timestamp,
          secretAESRequestKeyStub,
        );

        const xhmacHash = () => {
          try {
            const hmac = crypto
              .createHmac('sha256', publicKey)
              .update(`payload does not match${timestamp}`)
              .digest('hex');

            const encrypted = crypto
              .publicEncrypt(
                {
                  key: publicKey,
                  padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(hmac, 'hex'),
              )
              .toString('base64');

            const hmacSignature = `${bodyRequestEncryption}|${encrypted}`;

            return hmacSignature;
          } catch (error) {
            loggerServiceMocked.error('-- signature failure -- ', error);

            throw error;
          }
        };

        await cryptographyService.verifySignature(
          xhmacHash(),
          hmacTimestamp,
          bodyRequestEncryption,
        );
      } catch (error) {
        expect(error.messages).toContain('Hash Inválido');
      }
    });

    it('should throw BadRequestError on expired hash', async () => {
      try {
        const bodyRequestEncryption = await cryptographyService.encrypt(
          JSON.stringify(bodyRequestStub),
          secretAESRequestKeyStub,
        );
        // set old date for force expire date
        const timestamp = new Date('2020-01-01').toISOString();
        const hmacTimestamp = await cryptographyService.encrypt(
          timestamp,
          secretAESRequestKeyStub,
        );

        const xhmacHash = () => {
          try {
            const rsaPublicKey = publicKey;

            const hmac = crypto
              .createHmac('sha256', publicKey)
              .update(bodyRequestEncryption + timestamp)
              .digest('hex');

            const encrypted = crypto
              .publicEncrypt(
                {
                  key: rsaPublicKey,
                  padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(hmac, 'hex'),
              )
              .toString('base64');

            const hmacSignature = `${bodyRequestEncryption}|${encrypted}`;

            return hmacSignature;
          } catch (error) {
            loggerServiceMocked.error('-- signature failure -- ', error);

            throw error;
          }
        };

        await cryptographyService.verifySignature(
          xhmacHash(),
          hmacTimestamp,
          bodyRequestEncryption,
        );
      } catch (error) {
        expect(error.messages).toContain('Hash Expirado');
      }
    });
  });

  describe('validateXToken', () => {
    it('should return true for a valid XToken', async () => {
      const validXToken = newXvalidateTokenStub;
      const EXPIRES_IN_1_MONTH = 60 * 60 * 24 * 30;
      const result = await cryptographyService.validateXToken(validXToken);

      expect(result).toBe(true);
      expect(cacheServiceMocked.set).toHaveBeenCalledWith(
        validXToken,
        '0',
        expect.objectContaining({ EX: EXPIRES_IN_1_MONTH }),
      );

      expect(result).toBe(result);
    });
  });

  it('should return false for an invalid XToken', async () => {
    const invalidXToken = '123456789';
    cacheServiceMocked.get.mockResolvedValue('cached-value');

    const result = await cryptographyService.validateXToken(invalidXToken);

    expect(result).toBe(false);
    expect(cacheServiceMocked.set).not.toHaveBeenCalled();
  });
});
