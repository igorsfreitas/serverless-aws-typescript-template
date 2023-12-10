import { ERequestType } from 'src/decorators/enum/request-validation.enum';
import { Validation } from 'src/decorators/request-validation.decorator';
import { ClassValidatorExampleStub } from '@tests/stubs/http/class-validator-example.stub';
import * as classValidator from 'class-validator';
import {
  mockValidateRequest,
  mockValidateFilteredBodyRequest,
  mockInvalidateRequest,
} from './constants/request-validation.constant';

describe('Validation decorator', () => {
  const mockFn = jest.fn();

  afterEach(() => {
    mockFn.mockClear(); // clear mock after each test
    jest.restoreAllMocks(); // restores all spies after each test
  });

  const mockOriginalMethod = mockFn;

  const mockDescriptor: PropertyDescriptor = {
    value: mockOriginalMethod,
  };

  it('should call the original method if validation passes', async () => {
    const validateSpy = jest
      .spyOn(classValidator, 'validate')
      .mockResolvedValue([]);

    const decorator = Validation(ClassValidatorExampleStub, ERequestType.BODY);
    const decoratedMethod = (
      decorator(
        {},
        'create',
        mockDescriptor,
      ) as unknown as TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
    ).value;

    await decoratedMethod?.(mockValidateRequest);

    expect(mockOriginalMethod).toHaveBeenCalledWith(mockValidateRequest);
    expect(validateSpy).toHaveBeenCalledWith(
      expect.any(ClassValidatorExampleStub),
    );
  });

  it('should transform object properties if whitelist option is enabled', async () => {
    const decorator = Validation(ClassValidatorExampleStub, ERequestType.BODY, {
      whitelist: true,
    });

    const decoratedMethod = (
      decorator(
        {},
        'create',
        mockDescriptor,
      ) as unknown as TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
    ).value;

    const result = await decoratedMethod?.(mockValidateFilteredBodyRequest);

    expect(result).toBe(result);
    expect(mockOriginalMethod).toHaveBeenCalledWith(
      mockValidateFilteredBodyRequest,
    );

    // Check if only the properties defined in the DTO class were kept in the event
    expect(mockValidateFilteredBodyRequest[ERequestType.BODY]).toEqual({
      field1: 'teste',
      field2: 0,
    });
  });

  it('should return error response if validation fails', async () => {
    const decorator = Validation(ClassValidatorExampleStub, ERequestType.BODY);
    const decoratedMethod = (
      decorator(
        {},
        'create',
        mockDescriptor,
      ) as unknown as TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
    ).value;

    try {
      await decoratedMethod?.(mockInvalidateRequest);
    } catch (error) {
      expect(error.code).toEqual(400);
      expect(error.messages).toEqual(['field2 should not be empty']);
      expect(error.code).toEqual(400);
      expect(error.error).toEqual('Bad Request');
    }

    expect(mockOriginalMethod).not.toHaveBeenCalled();
  });
});
