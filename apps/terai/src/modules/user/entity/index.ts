import { ArgsType, Field, ID, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}

@ArgsType()
export class UserId {
  @Field(() => Int)
  id: number;
}
