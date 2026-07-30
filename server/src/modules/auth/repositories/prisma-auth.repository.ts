import { PrismaClient, User } from "@prisma/client";
import { AuthRepository, CreateUserData } from "./auth.repository";
import { prisma } from "../../../config/prisma";

export class PrismaAuthRepository extends AuthRepository {
  create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
        data
    })
  }


  updatePassword(userId: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where:{
        id: userId
      },
      data: {
        passwordHash,
        lastPasswordUpdatedAt: new Date()
      }
    })
  }


  verifyEmail(userId: string): Promise<User> {
    return prisma.user.update({
      where:{
        id: userId
      },
      data:{
        emailVerified: true
      }
    })
  }


  incrementFailedLoginAttempts(userId: string): Promise<User> {
      return prisma.user.update({
        where:{
          id: userId
        },
        data:{
          failedLoginAttempts: {
            increment: 1
          }
        }
      })
  }


  resetFailedLoginAttempts(userId: string): Promise<User> {
    return prisma.user.update({
        where:{
          id: userId
        },
        data:{
          failedLoginAttempts: 0,
          lockedUntil: null
        }
      })
  }

  
  lockUser(userId: string, lockedUntil: Date): Promise<User> {
    return prisma.user.update({
        where:{
          id: userId
        },
        data:{
          lockedUntil
        }
      })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
