import React, { useContext } from "react";
import {Button, IconButton} from "@material-ui/core";
import {StateContext} from "../../providers/StateProvider";
import {auth, provider} from "../../firebase";
import {actionTypes} from "../../reducer";
import { DarkModeContext } from "../../providers/ThemeDarkProvider";
import {Palette, SearchOutlined} from "@material-ui/icons";
import './Login.css';

interface LoginInterface {

}

const Login = (props: LoginInterface) => {
    const theme = useContext(DarkModeContext);
    const { login, loginContainer, isDark } = theme.mode;
    const [{}, dispatch] = useContext(StateContext);

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
            })
            .catch((error) => alert(error.message));
    };

    return (
        <React.Fragment>
            <div className="login" style={{...login}}>
                <div className="login__container" style={{...loginContainer}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.8 20.6">
                        <path fill="#FFFFFF"
                              d="M21.8,0.1h1.5v20.5h-1.5V0.1z M5.7,11.3h7.4V9.9H5.7V11.3z M0,0.1v20.5h1.5v-9.3h0V9.9h0V1.5h15.8V0.1H0z M69.1,0.1H57v20.5h1.5v-7.6h0v-1.4h0v-10H69c3.7,0,6.2,1.7,6.2,4.9v0.1c0,3-2.6,5-6.4,5H64v1.4h4.7c4.3,0,8-2.2,8-6.5V6.3 C76.7,2.4,73.6,0.1,69.1,0.1 M46.4,11.5l-6.1-9.9l-11.8,19h-1.6L39.6,0H41l7.1,11.5H46.4z M53.8,20.6h-1.7l-3.3-5.3h1.7L53.8,20.6z M112.6,18H86.3V2.2h26.2c-3.6,1-6,4.1-6,7.9v0C106.4,13.9,108.9,17.1,112.6,18 M114.9,15c-2.8,0-4.8-2.3-4.8-5v0 c0-2.7,1.9-4.9,4.8-4.9s4.8,2.3,4.8,5v0C119.6,12.8,117.7,15,114.9,15 M117.3,2.2h8V18H117c3.7-0.9,6.2-4.1,6.2-7.9v0 C123.3,6.3,120.9,3.2,117.3,2.2 M136.1,11.9l-7.4-9.7h7.4V11.9z M128.8,7.9l7.7,10.1h-7.7V7.9z M141.8,18h-2.3V2.2h2.3V18z"></path>
                    </svg>
                    <div style={{...loginContainer}}>
                        <h1>MBA - 1SCJO</h1>
                    </div>
                    <Button style={{...loginContainer.buttons}} type="submit" onClick={signIn}>
                        Continue with Google
                    </Button>
                    <div className="mode_theme">
                        <IconButton onClick={() => setTheme(theme)}>
                            <Palette color={isDark ? "primary" : "secondary"}/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const setTheme = (darkMode: DarkModeContext) => {
    const isDark = darkMode.mode.isDark;
    darkMode.dispatch(!isDark);
};

export default Login;

