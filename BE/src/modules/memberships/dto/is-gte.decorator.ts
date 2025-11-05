import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsGte(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGte',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropName];
          if (value === undefined || value === null) return true;
          if (typeof value !== 'number' || typeof relatedValue !== 'number')
            return false;
          return value >= relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropName] = args.constraints;
          return `${args.property} must be greater than or equal to ${relatedPropName}`;
        },
      },
    });
  };
}
