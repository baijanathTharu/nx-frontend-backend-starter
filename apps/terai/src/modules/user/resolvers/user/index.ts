/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Service } from 'typedi';
import bcrypt from 'bcryptjs';
import { User, UserId } from '../../entity';
import { UserService } from '../../services';
import { RegisterInput } from '../../inputs/register_input';
import { isAuth, MyContext } from 'apps/terai/src/middlewares/is_auth';
import { logger } from 'apps/terai/src/middlewares/logger';

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    const userId = ctx.req.session.userId;
    if (!userId) {
      return null;
    }
    return this.userService.findOneById(userId);
  }

  @UseMiddleware(logger)
  @Query(() => User, { nullable: true })
  async user(@Args() { id }: UserId): Promise<User | null> {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  async register(
    @Arg('registerInput')
    { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createOne({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    return user;
  }
}
