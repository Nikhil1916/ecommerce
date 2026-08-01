import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../../auth/auth.module";

export const createUserRouter = (
    userController: UserController
): Router => {
    const router = Router();
    router.get(
        "/me",
        authMiddleware.authenticate,
        userController.getMe
    );
    return router;
};