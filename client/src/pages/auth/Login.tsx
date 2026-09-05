import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../../hooks/useLogin";

import styles from "./Login.module.css";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "../../store/auth/auth.slice";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../utils/api-error";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("auth.login.validation.email"),

  password: z
    .string()
    .min(1, "auth.login.validation.password"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
     mode: "onTouched",
    reValidateMode: "onChange",
  });



  const onSubmit = (data: LoginFormData) => {
    console.log("Login:", data);
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        console.log("Login successful:", response);
        dispatch(setUser(response.data.user));
        toast.success(t("auth.login.success"));
        navigate("/dashboard");
      },
      onError: (error) => {
        console.error("Login failed:", error);
        toast.error(getApiErrorMessage(error));
      }
    })
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
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>{t("auth.login.title")}</h2>

            <p>
              {t("auth.login.subtitle")}{" "}
              <Link to="/register">
                {t("auth.login.createAccount")}
              </Link>
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">
                {t("auth.login.email")}
              </label>

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
                <label htmlFor="password">
                  {t("auth.login.password")}
                </label>

                <Link to="/forgot-password">
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder={t("auth.login.passwordPlaceholder")}
                {...register("password")}
                className={errors.password ? styles.inputError : ""}
              />

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
              {
                loginMutation.isPending ? t("auth.login.signingIn") : t("auth.login.signin")
              }
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;