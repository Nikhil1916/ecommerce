import { AuthenticatedUser } from "../../../types/express";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async getMe(
    user: AuthenticatedUser
  ): Promise<AuthenticatedUser> {
    return user;
  }
}