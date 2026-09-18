import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearUser } from "../../store/auth/auth.slice";
import { useLogout } from "../../hooks/useLogout";
import { useCart } from "../../hooks/useCart";

import styles from "./Header.module.css";
import ThemeSelector from "../common/ThemeSelector";

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);

  const { data: cartData } = useCart();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(clearUser());
        navigate("/login", { replace: true });
      },
    });
  };
  const cart = cartData?.data;

  const cartItemCount =
    cart && "items" in cart
      ? cart.items.reduce((total, item) => total + item.quantity, 0)
      : 0;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.logo}>
          My Store
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Cart ({cartItemCount})
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Orders
          </NavLink>
        </nav>

        <div className={styles.userSection}>
          {user && (
            <span className={styles.userName}>
              {user.firstName} {user.lastName}
            </span>
          )}

          <ThemeSelector />

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
