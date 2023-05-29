import { ApiProperty } from '@nestjs/swagger';
import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { IsNotEmpty, registerDecorator } from 'class-validator';
import type { PushSubscription as _PushSubscriptionJSON } from 'web-push';

function IsValidKeys(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsValidKeys',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: _PushSubscriptionJSON['keys']) {
          const { p256dh, auth } = value || {};
          return Boolean(p256dh && auth);
        },
        defaultMessage(validationArguments: ValidationArguments): string {
          return `${validationArguments.property} is required, and must be an object with p256dh and auth keys`;
        },
      },
    });
  };
}

export class PushSubscriptionJSON {
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  expirationTime?: number;

  @ApiProperty({
    required: false,
  })
  @IsValidKeys()
  keys: _PushSubscriptionJSON['keys'];
}
