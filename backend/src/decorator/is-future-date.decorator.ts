import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate.getTime() > currentDate.getTime();
        },
        defaultMessage() {
          return 'Due date must be in the future';
        },
      },
    });
  };
}
