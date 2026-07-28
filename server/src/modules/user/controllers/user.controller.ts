import { UserService } from "../services/user.service";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

export class UserController {
//   async register(req, res) {
//     // await userService.register(...)
//   }
}