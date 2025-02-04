import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 3. Interceptor (before handler) will be executed before the handler method.
    const now = Date.now();
    const response = context.switchToHttp().getResponse();
    console.log('3 - LoggerInterceptor');
    return next.handle().pipe(
      tap((data) => {
        // 7. Interceptor (after handler) will be executed after the handler method.
        const responseTime = Date.now() - now;
        const statusCode = response.statusCode;
        console.log('Response...  Status:', statusCode, ' Body:', data);
        console.log(`Response time: ${responseTime}ms`);
        console.log('7 - LoggerInterceptor');
      }),
    );
  }
}
