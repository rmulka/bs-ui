import React from 'react';

import PlayerDataContext from '../context/PlayerDataContext';
import playerDataReducer, { PLAYER_STORAGE_KEY } from "../reducer/playerDataReducer";
import useReducerWithLocalStorage from "../hooks/useReducerWithLocalStorage";

const initialState = {
    playerId: null,
    playerName: null
}

const PlayerDataProvider = ({ children }) => {
    const [playerDataState, playerDataDispatch] = useReducerWithLocalStorage(playerDataReducer, initialState, PLAYER_STORAGE_KEY);

    return (
        <PlayerDataContext.Provider value={{ playerDataState, playerDataDispatch }}>
            {children}
        </PlayerDataContext.Provider>
    );
};

export default PlayerDataProvider;