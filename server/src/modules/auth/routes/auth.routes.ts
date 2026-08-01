import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { RegisterUserSchema } from "../schemas/register-user.schema";
import { AuthController } from "../controllers/auth.controller";
import { LoginUserSchema } from "../schemas/login-user.schema";

export const createAuthRouter = (
    authController: AuthController
): Router => {

    const router = Router();

    router.post(
        "/register",
        validate(RegisterUserSchema),
        authController.register
    );

    router.post(
        "/login",
        validate(LoginUserSchema),
        authController.login.bind(authController)
    );

    router.post("/refresh", authController.refreshToken.bind(authController));

    router.post("/logout", authController.logout)

    router.post("/logout-all", authController.logoutAll);

    return router;
};