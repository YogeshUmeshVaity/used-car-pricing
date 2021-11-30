import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data is whatever you provide as the argument of the decorator. e.g. data will be 'abc',
  // if you call the decorator like CurrentUser('abc'). Since we are not passing any argument to
  // this decorator, we type it as 'never' instead of unknown or any. Because the type is 'never',
  // if we provide any argument to the decorator, we'll get an error, which is good for type safety.
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Whatever we return here is going be our argument wherever we use this decorator.
    return request.currentUser;
  },
);
