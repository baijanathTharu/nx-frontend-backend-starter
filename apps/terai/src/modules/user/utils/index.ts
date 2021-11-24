import { graphql } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AuthResolver, UserResolver } from '../resolvers';

interface Options {
  source: string;
  // variableValues?: Maybe<{
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   [key: string]: any;
  // }>;
}

export const gCall = async ({ source }: Options) => {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    container: Container,
    validate: true,
  });
  return graphql({
    schema,
    source,
  });
};
