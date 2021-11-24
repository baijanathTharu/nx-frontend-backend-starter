import 'reflect-metadata';

import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import cors from 'cors';
import { Container } from 'typedi';
import { AuthResolver, UserResolver } from './modules/user/resolvers';
import { origin_url, server_port } from './constants/config';

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    container: Container,
    emitSchemaFile: path.join(
      process.cwd(),
      '/__generated__/api-schema.graphql'
    ),
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req, res }: any) => ({ req, res }),
  });

  await apolloServer.start();

  const app = Express();

  /* *** cors *** */
  app.use(
    cors({
      credentials: true,
      origin: origin_url,
    })
  );
  /* *** cors *** */

  /* *** session middleware *** */
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      name: 'qid',
      secret: 'put_in_env',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7years
      },
    })
  );
  /* *** session middleware *** */

  apolloServer.applyMiddleware({ app });

  app.listen(server_port, () => {
    console.log(`Server listening at http://localhost:${server_port}/graphql`);
  });
};

main().catch((e) => {
  console.log('Something went wrong!!: \n', e);
  process.exit(0);
});
