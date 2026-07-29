import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { RegisterUserSchema } from "../schemas/register-user.schema";
import { AuthController } from "../controllers/auth.controller";

export const createAuthRouter = (
    authController: AuthController
): Router => {

    const router = Router();

    router.post(
        "/register",
        validate(RegisterUserSchema),
        authController.register
    );

    return router;
};