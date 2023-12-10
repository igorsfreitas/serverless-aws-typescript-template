/**
 * @param decorators[]
 * @returns apply group of decorators
 */
export function ApplyDecorators(
  ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>,
  ) => {
    decorators.forEach((decorator) => {
      if (propertyKey && descriptor) {
        if (target instanceof Function && !descriptor) {
          (decorator as ClassDecorator)(target);
        }
        (decorator as MethodDecorator | PropertyDecorator)(
          target,
          propertyKey,
          descriptor,
        );
      }
    });
  };
}
