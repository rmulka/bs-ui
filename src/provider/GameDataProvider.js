import React, { useReducer } from 'react';

import GameDataContext from '../context/GameDataContext';
import gameDataReducer from "../reducer/gameDataReducer";

const initialState = {
    startUp: true,
    loading: false,
    allGames: {},
    currentGameId: null,
    currentGameData: {}
}

const GameDataProvider = ({ children }) => {
    const [gameDataState, gameDataDispatch] = useReducer(gameDataReducer, initialState);

    return (
        <GameDataContext.Provider value={{ gameDataState, gameDataDispatch }}>
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataProvider;