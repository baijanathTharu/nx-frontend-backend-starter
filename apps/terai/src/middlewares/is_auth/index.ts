import { MiddlewareFn } from 'type-graphql';

import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';

export interface MyContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
}

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userId) {
    throw new Error('not authenticated');
  }
  return next();
};
