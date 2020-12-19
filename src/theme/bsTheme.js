import { createMuiTheme } from '@material-ui/core/styles';
import { green, grey, red } from '@material-ui/core/colors';

const primary = { main: green[600] };
const secondary = { main: grey[50] };
const error = { main: red[800] };

export const BACKGROUND_LIGHT = '#43a047';
export const BACKGROUND_DARK = '#212121';

const drinkLoggerTheme = createMuiTheme({
    palette: {
        primary: primary,
        secondary: secondary,
        error: error,
    },
    typography: {
        useNextVariants: true,
    },
    overrides: {
        // MuiTabs: {
        //     indicator: {
        //         height: '0px',
        //     },
        // },
        // MuiButton: {
        //     root: {
        //         '&:hover': {
        //             backgroundColor: grey[400],
        //             fontWeight: 'bold',
        //         },
        //         '&$selected': {
        //             backgroundColor: grey[600],
        //             color: grey[300],
        //             fontWeight: 'bold',
        //         },
        //     },
        // },
    },
    props: {
        MuiButton: {
            variant: 'contained',
        },
    },
});

export const titleFont = createMuiTheme({
    typography: {
        fontFamily: [
            'Carter One',
            'cursive'
        ].join(','),
        h1: {
            fontWeight: 'bold',
        },
        fontSize: 50
    }
});

export default drinkLoggerTheme;