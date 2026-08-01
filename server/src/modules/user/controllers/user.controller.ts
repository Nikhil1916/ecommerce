import { UserService } from "../services/user.service";
import { PrismaUserRepository } from "../repositories/prisma-user.repository";
import { ApiResponse } from "../../../core/ApiResponse";
import { asyncHandler } from "../../../core/asyncHandler";

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

export class UserController {
    getMe = asyncHandler(async (req, res) => {
    res.status(200).json(
        ApiResponse.success(
            "User profile fetched successfully.",
            req.user,
            req.requestId
        )
    );
});

}