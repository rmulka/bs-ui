import React from 'react';

import GameDataContext from '../context/GameDataContext';
import gameDataReducer, { GAME_STORAGE_KEY } from "../reducer/gameDataReducer";
import useReducerWithLocalStorage from "../hooks/useReducerWithLocalStorage";

const initialState = {
    startUp: true,
    loading: false,
    allGames: {},
    inGame: false,
    currentGameId: null,
    currentGameData: {}
}

const GameDataProvider = ({ children }) => {
    const [gameDataState, gameDataDispatch] = useReducerWithLocalStorage(gameDataReducer, initialState, GAME_STORAGE_KEY);

    return (
        <GameDataContext.Provider value={{ gameDataState, gameDataDispatch }}>
            {children}
        </GameDataContext.Provider>
    );
};

export default GameDataProvider;