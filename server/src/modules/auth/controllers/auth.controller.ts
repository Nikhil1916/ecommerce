import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../../../core/ApiResponse";
import { asyncHandler } from "../../../core/asyncHandler";
import { clearCookieOptions, getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from "../../../utils/cookie.util";
import { LoginUserDto } from "../schemas/login-user.schema";
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req, res) => {
    const user = await this.authService.register(req.body);

    return res
      .status(201)
      .json(ApiResponse.success("User registered successfully.", user));
  });

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const dto: LoginUserDto = req.body;

      const result = await this.authService.login(dto);

      res.cookie(
        "accessToken",
        result.accessToken,
        getAccessTokenCookieOptions(),
      );

      res.cookie(
        "refreshToken",
        result.refreshToken,
        getRefreshTokenCookieOptions(),
      );

      res.status(200).json(
        ApiResponse.success("Login successful.", {
          user: result.user,
        }),
      );
    },
  );

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      const result = await this.authService.refreshToken(refreshToken);

      res.cookie(
        "accessToken",
        result.accessToken,
        getAccessTokenCookieOptions(),
      );

      res.cookie(
        "refreshToken",
        result.refreshToken,
        getRefreshTokenCookieOptions(),
      );

      res.status(200).json(
        ApiResponse.success(
          "Token refreshed successfully.",
          {
            user: result.user,
          },
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    await this.authService.logout(refreshToken);

    res.clearCookie("accessToken", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);
    res.status(200).json(
        ApiResponse.success(
            "Logout successful."
        )
    );
});

  
}