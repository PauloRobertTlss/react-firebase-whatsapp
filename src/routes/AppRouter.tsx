import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import routes from "./index";
import {StateContext} from "../providers/StateProvider";
import Login from "../Pages/Login/Login";
import {DarkModeContext, DarkModeProvider} from "../providers/ThemeDarkProvider";
import {useContext, useEffect, useRef, useState} from "react";
import Fade from '@material-ui/core/Fade';
import {Face} from "@material-ui/icons";


const AppRouter = () => {

    const [authorized, setAuthorized] = useState<boolean>(false);
    const [user, dispatch] = useContext(StateContext);

    useEffect(() => {
        console.log(`%c reduce %c user`, 'background: orange; color: black;border-radius: 12px 0 0 12px','background: #fbe4a0; color: back;border-radius: 0 12px 12px 0',user);
        const credentials =  user.hasOwnProperty('user') ? user.user : null;

        setAuthorized(credentials !== null);
        return () => {
            //
        }
    }, [user]);



    console.log(user)
    return (
        <div className="zazapp">
            {!authorized ? (

                <DarkModeProvider>
                        <Login/>
                </DarkModeProvider>
            ) : (
                <Fade in={authorized}>
                <div className="zazapp-body">
                    <Router>
                        <Switch>
                            {
                                routes.map((route, key) => {
                                    return (
                                        <Route key={key}
                                               path={route.path}
                                               component={route.component}
                                               exact={route.exact === true}
                                        />
                                    );
                                })
                            }
                        </Switch>
                    </Router>
                </div>
                </Fade>
            )}
        </div>
    )
};

export default AppRouter;