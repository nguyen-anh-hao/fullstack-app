// 8. Exeption Filter for HttpException

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { IResponse } from '../interfaces/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus ? exception.getStatus() : 500;
    console.log('Error...  Status:', status, ' Message:', exception.message);
    // console.log('8 - HttpExceptionFilter');
    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
      error: exception.name || 'Error',
    } as IResponse<T>);
  }
}
