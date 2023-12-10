import { generateXToken } from '@tests/utils/cryptography.utils';

export const secretAESRequestKeyStub = 'fc899e7a50add7bea258f23c3a8cf604';

export const secretAESResponseKeyStub = '7a2bf7099990c2ef5655af61437330e1';

export const bodyRequestStub = {
  documento: '123456',
  conta: {
    agencia: '2222',
    conta: '3333',
  },
  data: '2023-11-16',
};

export const newXvalidateTokenStub = generateXToken();
