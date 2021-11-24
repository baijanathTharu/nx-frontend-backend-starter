import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { Service } from 'typedi';
import { UserService } from '../../services';
import { LoginInput } from '../../inputs/login_input';
import { User } from '../../entity';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { MyContext } from 'apps/terai/src/middlewares/is_auth';

@Service()
@Resolver()
export class AuthResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('loginInput')
    { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    /* *** here we can send cookie *** */
    ctx.req.session.userId = user.id;
    /* *** here we can send cookie *** */

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res, rej) =>
      ctx.req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return rej(false);
        }
        ctx.res.clearCookie('qid');

        return res(true);
      })
    );
  }
}
