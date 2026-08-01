import { AuthController } from "./controllers/auth.controller";
import { AuthRepository } from "./repositories/auth.repository";
import { PrismaAuthRepository } from "./repositories/prisma-auth.repository";
import { RefreshTokenRepository } from "./repositories/prisma-refresh-token-repository";
import { IRefreshTokenRepository } from "./repositories/refresh-token-repository";
import { createAuthRouter } from "./routes/auth.routes";
import { AuthService } from "./services/auth.service";
import { AuthMiddleware } from "../../middlewares/authenticate.middleware";

const repository:AuthRepository = new PrismaAuthRepository();
const refreshRepo = new RefreshTokenRepository();
const service = new AuthService(repository, refreshRepo);
const controller = new AuthController(service);
export const authMiddleware = new AuthMiddleware(repository);


export const authRouter = createAuthRouter(controller);
// export const authMiddleware;