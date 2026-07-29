import { config } from "../../../config/index";
import { ApiError } from "../../../core/ApiError";
import { toUserResponseDto } from "../mapper/auth.mapper";
import { AuthRepository } from "../repositories/auth.repository";
import { RegisterUserDto, UserResponseDto } from "../schemas/register-user.schema";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists with this email."
        );
    }
    
    const passwordHash = await bcrypt.hash(dto.password, config.BCRYPT_SALT_ROUNDS);
    const user = await this.authRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
    });

    return toUserResponseDto(user);

  }
}
