import { AuthController } from "./controllers/auth.controller";
import { AuthRepository } from "./repositories/auth.repository";
import { PrismaAuthRepository } from "./repositories/prisma-auth.repository";
import { createAuthRouter } from "./routes/auth.routes";
import { AuthService } from "./services/auth.service";

const repository:AuthRepository = new PrismaAuthRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

export const authRouter = createAuthRouter(controller);