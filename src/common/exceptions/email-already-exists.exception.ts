import { UnprocessableEntityException } from '@nestjs/common';

export class EmailAlreadyExistsException extends UnprocessableEntityException {
  constructor(email: string) {
    super(`Email '${email}' is already registered`);
  }
}
