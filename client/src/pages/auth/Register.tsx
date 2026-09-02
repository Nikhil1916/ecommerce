import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register:", data);
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>First Name</label>

          <input
            {...register("firstName")}
            placeholder="Enter your first name"
          />

          {errors.firstName && (
            <p>{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label>Last Name</label>

          <input
            {...register("lastName")}
            placeholder="Enter your last name"
          />

          {errors.lastName && (
            <p>{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
          />

          {errors.email && (
            <p>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>

          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password"
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        <button type="submit">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;