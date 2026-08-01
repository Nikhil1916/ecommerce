import { ApiResponse } from "../../../core/ApiResponse";
import { asyncHandler } from "../../../core/asyncHandler";


export class UserController {
    getMe = asyncHandler(async (req, res) => {
        // console.log("User profile fetched successfully.", req.user);
    res.status(200).json(
        ApiResponse.success(
            "User profile fetched successfully.",
            req.user,
            req.requestId
        )
    );
});

}