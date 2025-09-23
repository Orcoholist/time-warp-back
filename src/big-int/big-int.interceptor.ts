import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const convert = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(convert);
          }
          if (obj && typeof obj === 'object') {
            return Object.entries(obj).reduce((acc, [key, value]) => {
              acc[key] =
                typeof value === 'bigint' ? value.toString() : convert(value);
              return acc;
            }, {});
          }
          return obj;
        };

        return convert(data);
      }),
    );
  }
}
