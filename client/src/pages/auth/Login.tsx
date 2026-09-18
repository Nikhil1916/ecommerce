import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../../hooks/useLogin";

import styles from "./Login.module.css";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "../../store/auth/auth.slice";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../utils/api-error";
import ThemeSelector from "../../components/common/ThemeSelector";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("auth.login.validation.email"),

  password: z.string().min(1, "auth.login.validation.password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "nikhilchawla9013@gmail.com",
      password: "Password@123",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login:", data);
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        dispatch(setUser(response.data.user));
        toast.success(t("auth.login.success"));
        navigate("/dashboard");
      },
      onError: (error) => {
        console.error("Login failed:", error);
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
            {t("auth.login.brandTitle")}
            <span>{t("auth.login.brandTitleHighlight")}</span>
          </h1>

          <p>{t("auth.login.brandDescription")}</p>
        </div>
      </section>

      <section className={styles.formSection}>
         <div className={styles.themeSelector}>
    <ThemeSelector />
  </div>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>{t("auth.login.title")}</h2>

            <p>
              {t("auth.login.subtitle")}{" "}
              <Link to="/register">{t("auth.login.createAccount")}</Link>
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">{t("auth.login.email")}</label>

              <input
                id="email"
                type="email"
                placeholder={t("auth.login.emailPlaceholder")}
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
              <div className={styles.labelRow}>
                <label htmlFor="password">{t("auth.login.password")}</label>

                <Link to="/forgot-password">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <div className={styles.passwordField}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.passwordPlaceholder")}
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
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? t("auth.login.signingIn")
                : t("auth.login.signin")}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
