import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../../auth/auth.module";
import { UpdateUserSchema } from "../schemas/update-user-schema";

export const createUserRouter = (
    userController: UserController
): Router => {
    const router = Router();
    router.get(
        "/me",
        authMiddleware.authenticate,
        userController.getMe
    );


    router.patch(
      "/me",
      (req, res, next) => {
   console.log("BODY BEFORE VALIDATE:", req.body);
   next();
 },
      authMiddleware.authenticate,
      validate(UpdateUserSchema),
      userController.updateMe,
    );

    return router;
};