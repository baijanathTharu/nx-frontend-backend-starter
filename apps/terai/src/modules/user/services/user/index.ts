/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Service } from 'typedi';
import { RegisterInput } from '../../inputs/register_input';
import { User } from '../../entity';
import { prisma } from 'apps/terai/src/prisma';

@Service()
export class UserService {
  findOneById(id: number): Promise<User | null> {
    return prisma.users.findFirst({
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string): Promise<(User & { password: string }) | null> {
    return prisma.users.findFirst({
      where: {
        email,
      },
    });
  }

  createOne(data: RegisterInput): Promise<User> {
    return prisma.users.create({
      data: {
        ...data,
      },
    });
  }
}
