import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  // The data variable here is the default object the Nest sends. e.g. User entity object.
  // We convert that to our dto type.
  // The map function maps the default Observable to our desired Observable.
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // The pipe() function take observables as a input and it returns another observable. 
    // The previous observable stays unmodified.
    return handler.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          // This makes sure only the properties with @Expose in the DTO will be included.
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
