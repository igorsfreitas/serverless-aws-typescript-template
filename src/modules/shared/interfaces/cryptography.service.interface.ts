export interface ICryptographyService {
  secretKeyGenerate(keySize: number): string;
  encrypt(str: string, secretKey: string): Promise<string>;
  decrypt(stg: string, secretKey: string): Promise<unknown>;
  verifySignature(
    hmac: string,
    hmacTimestamp: string,
    dataEncrypted: string,
  ): Promise<void>;
}
