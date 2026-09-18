import {useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";


const getSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
}

const getInitialTheme = (): Theme => {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if(theme == "light" || theme == "dark" || theme == "system") return theme;
    return "system";
}

export const useTheme = () => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(()=>{
        const root = document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const applyTheme = () => {
            const actualTheme = theme == "system" ? getSystemTheme() : theme;
            console.log(theme, getSystemTheme());
            root.setAttribute("data-theme", actualTheme);
        }

        applyTheme();

        if(theme == "system") {
            mediaQuery.addEventListener("change", applyTheme);
        }

        localStorage.setItem(THEME_STORAGE_KEY, theme);
        return () => {
            mediaQuery.removeEventListener("change", applyTheme);
        }
    }, [theme])

    return {
        theme,
        setTheme
    }
}