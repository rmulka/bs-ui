import React, { useReducer } from 'react';

import PlayerDataContext from '../context/PlayerDataContext';
import playerDataReducer from "../reducer/playerDataReducer";

const initialState = {
    playerId: null,
    playerName: null,
    inGame: false,
    gameId: null
}

const PlayerDataProvider = ({ children }) => {
    const [playerDataState, playerDataDispatch] = useReducer(playerDataReducer, initialState);

    return (
        <PlayerDataContext.Provider value={{ playerDataState, playerDataDispatch }}>
            {children}
        </PlayerDataContext.Provider>
    );
};

export default PlayerDataProvider;