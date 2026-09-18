
import { useTheme, type Theme } from "../../hooks/useTheme";
import styles from "./ThemeSelector.module.css";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme);
  };

  return (
    <select
      className={styles.selector}
      value={theme}
      onChange={handleChange}
      aria-label="Select theme"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
};

export default ThemeSelector;