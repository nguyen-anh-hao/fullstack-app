import {
  ValidationPipe as NestValidationPipe,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors
          .map((error) =>
            error.constraints
              ? Object.values(error.constraints).join(', ')
              : 'no constraints',
          )
          .join(', ');
        return new BadRequestException(message);
      },
    });
  }

  transform(value, metadata) {
    console.log('4 - ValidationPipe');
    return super.transform(value, metadata);
  }
}
