import React, {createContext, useCallback, useMemo, useState,} from 'react';

import defaultTheme from './themes/default';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';

const themeNames = {
    default: 'default',
};

const ThemesToThemeNames = {
    [themeNames.default]: defaultTheme,
};

export const ThemeContext = createContext<{
    changeTheme: (themeName: keyof typeof themeNames) => void;
    theme: typeof defaultTheme;
}>({
    changeTheme: () => {},
    theme: defaultTheme,
});

interface ThemeProviderProps {
    children: React.ReactNode;
    themeName?: keyof typeof themeNames;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    themeName: inputThemeName = themeNames.default,
}) => {
    const [state, setState] = useState({
        themeName: inputThemeName,
    });

    const changeTheme = useCallback((themeName: keyof typeof themeNames) => {
        setState(prevState => ({
            ...prevState,
            themeName,
        }));
    }, []);

    const currentTheme = ThemesToThemeNames[state.themeName] || defaultTheme;

    const contextValue = useMemo(() => ({
        changeTheme,
        theme: currentTheme,
    }), [state.themeName, changeTheme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={currentTheme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
