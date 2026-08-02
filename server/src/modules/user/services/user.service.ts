import { AuthenticatedUser } from "../../../types/express";
import { UserRepository } from "../repositories/user.repository";
import {UpdateUserDto, UserResponseDto} from "../dto/user.types";
import { prisma } from "../../../config/prisma";
import { User } from "@prisma/client";
import { UserMapper } from "../mapper/user-response-mapper";
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getMe(
    user: AuthenticatedUser
  ): Promise<AuthenticatedUser> {
    return user;
  }

  async updateMe(
    userId: string,
    dto: UpdateUserDto
): Promise<UserResponseDto> {
    const updatedUser =  await this.userRepository.update(userId, dto);
    return UserMapper.toResponseDto(updatedUser);
}
}