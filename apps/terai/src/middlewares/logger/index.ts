import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../is_auth';

export const logger: MiddlewareFn<MyContext> = ({ args }, next) => {
  console.log('Args', args);
  return next();
};
