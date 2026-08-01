import { UserController } from "./controllers/user.controller";
import { PrismaUserRepository } from "./repositories/prisma-user.repository";
import { createUserRouter } from "./router/user.routes";
import { UserService } from "./services/user.service";

const userController = new UserController(new UserService(new PrismaUserRepository()));
const userRouter = createUserRouter(userController);

export { userRouter };
