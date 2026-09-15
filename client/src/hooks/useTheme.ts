import { use, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";


const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
}

const getInitialTheme = (): Theme => {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if(theme == "light" || theme == "dark" || theme == "system") return theme;
    // return localStorage.getItem(THEME_STORAGE_KEY);
    return "system";
}

export const useTheme = () => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(()=>{
        const root = document.documentElement;
        const applyTheme = () => {
            const actualTheme = theme == "system" ? getSystemTheme() : theme;
            root.setAttribute("data-theme", actualTheme);
        }

        applyTheme();
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme])

    return {
        theme,
        setTheme
    }
}