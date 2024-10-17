import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsImageFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImageFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; 
          // Check if the value has mimetype
          return value.mimetype && value.mimetype.startsWith('image/');
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be an image file!`;
        },
      },
    });
  };
}