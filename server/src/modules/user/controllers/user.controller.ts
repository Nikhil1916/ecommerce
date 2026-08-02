import { Request, Response } from "express";
import { asyncHandler } from "../../../core/asyncHandler";
import { ApiResponse } from "../../../core/ApiResponse";
import { UserService } from "../services/user.service";
import { UpdateUserDto } from "../dto/user.types";

export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getMe(req.user!);

    res.status(200).json(
      ApiResponse.success(
        "Profile fetched successfully.",
        user,
        req.requestId
      )
    );
  });

  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const updatedUser = await this.userService.updateMe(
      req.user!.id,
      req.body as UpdateUserDto
    );

    res.status(200).json(
      ApiResponse.success(
        "Profile updated successfully.",
        updatedUser,
        req.requestId
      )
    );
  });



}