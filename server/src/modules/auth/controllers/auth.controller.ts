import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../../../core/ApiResponse";
import { asyncHandler } from "../../../core/asyncHandler";
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req, res) => {
    const user = await this.authService.register(req.body);

    return res
      .status(201)
      .json(ApiResponse.success("User registered successfully.", user));
  });
}