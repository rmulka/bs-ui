import { red, purple, green, lightBlue, orange, yellow, pink, teal } from "@material-ui/core/colors";

const shuffle = array => [...Array(array.length)]
        .map((...args) => Math.floor(Math.random() * (args[1] + 1)))
        .reduce((a, rv, i) => ([a[i], a[rv]] = [a[rv], a[i]]) && a, array);

export const assignColors = (players) => {
    const playerColors = {};
    const colors = shuffle([red[500], purple[500], green[500], lightBlue[500], orange[500], yellow[500], pink[500], teal[500]])
    players.forEach(({ id, name }, idx) => playerColors[id] = colors[idx]);
    return playerColors;
};

