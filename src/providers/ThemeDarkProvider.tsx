import React, {Context, createContext, useReducer, useEffect} from "react";

export const LIGHT_THEME: Theme = {
    login: {
        backgroundColor: '#cfddd5'
    },
    loginContainer: {
        backgroundColor: '#afbeae',
        color: '#5f6d5d',
        buttons: {
            backgroundColor: '#647f57',
            color: '#ecf5f2'
        },
        text:{
            color: '#1b2320'
        }
    },
    background: "#fafafa" as BackgroundColors,
    color: "#000000" as ForegroundColors,
    isDark: false
}

export const DARK_THEME: Theme = {
    login: {
        backgroundColor: '#2a2f2c'
    },
    loginContainer: {
        backgroundColor: '#282d2f',
        color: '#4db5ab',
        buttons: {
            backgroundColor: '#3e5b66',
            color: '#27b68d'
        },
        text:{
            color: '#5de2b5'
        }
    },
    background: "#333333" as BackgroundColors,
    color: "#fafafa" as ForegroundColors,
    isDark: true
};

export type BackgroundColors = "#333333" | "#fafafa";
export type ForegroundColors = "#000000" | "#fafafa";

export interface Theme {
    login: {
        backgroundColor?: string;
    },
    loginContainer: {
        backgroundColor?: string;
        color?: string,
        buttons: {
            backgroundColor?: string;
            color?: string
        },
        text:{
            color: string
        }
    },
    background: BackgroundColors;
    color: ForegroundColors;
    isDark: boolean;
}
interface DarkModeContext {
    mode: Theme;
    dispatch: React.Dispatch<any>;
}

const darkModeReducer = (_: any, isDark: boolean) =>
    isDark ? DARK_THEME : LIGHT_THEME;

const DarkModeContext: Context<DarkModeContext> = createContext(
    {} as DarkModeContext
);

const initialState =
    JSON.parse(localStorage.getItem("DarkMode") as string) || LIGHT_THEME;

const DarkModeProvider: React.FC = ({ children }) => {
    const [mode, dispatch] = useReducer(darkModeReducer, initialState);

    useEffect(() => {
        localStorage.setItem("DarkMode", JSON.stringify(mode));
    }, [mode]);

    return (
        <DarkModeContext.Provider
            value={{
                mode,
                dispatch
            }}
        >
            {children}
        </DarkModeContext.Provider>
    );
};

export { DarkModeProvider, DarkModeContext };