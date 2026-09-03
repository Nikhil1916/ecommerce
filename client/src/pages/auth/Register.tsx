import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import styles from "./Register.module.css";
import { useRegister } from "../../hooks/useRegister";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../utils/api-error";

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "auth.register.validation.firstNameMin")
    .max(50, "auth.register.validation.firstNameMax"),

  lastName: z
    .string()
    .trim()
    .min(2, "auth.register.validation.lastNameMin")
    .max(50, "auth.register.validation.lastNameMax"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("auth.register.validation.email"),

  password: z
    .string()
    .min(12, "auth.register.validation.passwordMin")
    .max(100, "auth.register.validation.passwordMax")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "auth.register.validation.passwordPattern",
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { t } = useTranslation();
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register:", data);
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
    });
  };

  return (
    <main className={styles.page}>
      <section className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>ShopSphere</div>

          <h1>
            {t("auth.register.brandTitle")}
            <span>{t("auth.register.brandTitleHighlight")}</span>
          </h1>

          <p>{t("auth.register.brandDescription")}</p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>{t("auth.register.title")}</h2>

            <p>
              {t("auth.register.subtitle")}{" "}
              <Link to="/login">{t("auth.register.signIn")}</Link>
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.nameFields}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">
                  {t("auth.register.firstName")}
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder={t("auth.register.firstNamePlaceholder")}
                  {...register("firstName")}
                  className={errors.firstName ? styles.inputError : ""}
                />

                {errors.firstName && (
                  <span className={styles.error}>
                    {t(errors.firstName.message ?? "")}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">{t("auth.register.lastName")}</label>

                <input
                  id="lastName"
                  type="text"
                  placeholder={t("auth.register.lastNamePlaceholder")}
                  {...register("lastName")}
                  className={errors.lastName ? styles.inputError : ""}
                />

                {errors.lastName && (
                  <span className={styles.error}>
                    {t(errors.lastName.message ?? "")}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">{t("auth.register.email")}</label>

              <input
                id="email"
                type="email"
                placeholder={t("auth.register.emailPlaceholder")}
                {...register("email")}
                className={errors.email ? styles.inputError : ""}
              />

              {errors.email && (
                <span className={styles.error}>
                  {t(errors.email.message ?? "")}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">{t("auth.register.password")}</label>

              <div className={styles.passwordField}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  {...register("password")}
                  className={errors.password ? styles.inputError : ""}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              {errors.password && (
                <span className={styles.error}>
                  {t(errors.password.message ?? "")}
                </span>
              )}

              <small className={styles.passwordHint}>
                {t("auth.register.passwordHint")}
              </small>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? t("auth.register.creatingAccount")
                : t("auth.register.createAccount")}
            </button>
            {registerMutation.isError && (
              <div className={styles.formError}>
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
