import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./router/user.routes";

const userController = new UserController();
const userRouter = createUserRouter(userController);

export { userRouter };
