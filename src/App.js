import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { MuiThemeProvider } from '@material-ui/core/styles';

import './App.css';
import muiTheme from './theme/bsTheme';
import BaseLayout from "./components/layout/baseLayout";
import PlayerDataProvider from "./provider/PlayerDataProvider";
import NameEntryPage from "./components/page/NameEntryPage";
import GamesPage from "./components/page/GamesPage";
import GameDataProvider from "./provider/GameDataProvider";
import Game from "./components/page/Game";

function App() {
  return (
      <MuiThemeProvider theme={muiTheme}>
          <Router>
              <div className="App">
                  {/*<header className="App-header">*/}
                  {/*</header>*/}
                  <BaseLayout>
                      <PlayerDataProvider>
                          <GameDataProvider>
                              <Switch>
                                  <Route exact path="/games/:gameId">
                                      <Game />
                                  </Route>
                                  <Route exact path="/games">
                                      <GamesPage />
                                  </Route>
                                  <Route exact path="/">
                                      <NameEntryPage />
                                  </Route>
                              </Switch>
                          </GameDataProvider>
                      </PlayerDataProvider>
                  </BaseLayout>
              </div>
          </Router>
      </MuiThemeProvider>
  );
}

export default App;
