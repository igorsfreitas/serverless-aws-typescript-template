import * as crypto from 'crypto';

export const generateRsakeys = async (): Promise<{
  privateKey: string;
  publicKey: string;
}> => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err); // Rejeitar a promessa em caso de erro
        } else {
          resolve({ publicKey, privateKey }); // Resolver a promessa em caso de sucesso
        }
      },
    );
  });
};

const calculateChecksum = (uuid: string): string => {
  let sum = 0;
  const cleanedUuid = uuid.replace(/-/g, '');
  for (const item of cleanedUuid) {
    sum += parseInt(item, 16);
  }
  return (sum % 65536).toString(16).padStart(4, '0');
};

const generateTokenSegment = (length: number): string => {
  const characters = '0123456789abcdef';
  let segment = '';
  for (let i = 0; i < length; i++) {
    segment += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return segment;
};

const getTimestamp = (): string => {
  const hrTime = process.hrtime.bigint();
  return hrTime.toString(16).padStart(16, '0').substring(0, 16);
};

export const generateXToken = (): string => {
  const timestamp = getTimestamp();
  const partialUuid = `${timestamp}-${generateTokenSegment(
    4,
  )}-${generateTokenSegment(4)}-${generateTokenSegment(
    4,
  )}-${generateTokenSegment(12)}`;
  const checksum = calculateChecksum(partialUuid);
  return `${partialUuid}-${checksum}`;
};
