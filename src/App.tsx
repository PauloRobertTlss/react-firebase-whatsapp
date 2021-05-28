import * as React from 'react';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Box, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import theme from "./theme";
import "./App.css";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {

    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Router>
                        <Box>
                            <AppRouter/>
                        </Box>
                    </Router>
            </MuiThemeProvider>
        </React.Fragment>
    );
}

export default App;
