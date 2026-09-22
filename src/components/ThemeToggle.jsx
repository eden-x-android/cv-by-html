import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

// Must match the key used by the pre-paint script in index.html
const STORAGE_KEY = 'cv-builder-theme';

const readInitialTheme = () => document.documentElement.dataset.theme || 'light';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(readInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Private mode / blocked storage: the theme still applies for this session.
        }
    }, [theme]);

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            className="toolbar-button theme-button"
            onClick={() => setTheme(nextTheme)}
            aria-label={label}
            data-tooltip={label}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;
