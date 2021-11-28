import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

/**
 * Just makes sure that the object that we pass to the constructor is of some class. Some what
 * better solution that passing 'any' to our Serialize decorator.
 */
interface ClassConstructor {
  new (...args: any[]): {};
}

/**
 * Wraps up the SerializeInterceptor in a decorator. So we don't have to write a big line of code
 * at the use-site. This class can be re-used for any DTO.
 * @param dto to serialize.
 * @returns the SerializeInterceptor.
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/**
 * Excludes the properties from the response data according to a specified DTO.
 */
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  // The data variable here is the default object the Nest sends. e.g. User entity object.
  // We convert that to our dto type.
  // The map operator for RxJS maps the default Observable to our desired Observable.
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
