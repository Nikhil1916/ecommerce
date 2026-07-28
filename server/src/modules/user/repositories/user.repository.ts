import { Prisma, User } from "@prisma/client";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract create(data: Prisma.UserCreateInput): Promise<User>;

  abstract update(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<User>;
}