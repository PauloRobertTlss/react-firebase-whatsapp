import {createMuiTheme, SimplePaletteColorOptions} from "@material-ui/core";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import {green} from "@material-ui/core/colors";

const palette: PaletteOptions = {
    primary: {
        main: '#79aec8',
        contrastText: '#fff'
    },
    secondary: {
        main: '#3a4746',
        contrastText: '#fff',
        dark: '#055a52'
    },
    background: {
        default: '#fff'
    },
    success: {
        main: green["500"],
    }
}

const theme = createMuiTheme({
    palette,
    overrides: {

    }
});

export default theme;