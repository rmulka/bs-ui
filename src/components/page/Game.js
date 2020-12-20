import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useUnload from "../../hooks/useUnload";
import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { deleteData, fetchData } from "../../util/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import { LEAVE_GAME, UPDATE_CURRENT_GAME } from "../../reducer/gameDataReducer";

const Game = () => {
    const history = useHistory();
    const { gameId } = useParams();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);

    useUnload(async e => {
        e.preventDefault();
        const requestBody = { player_id: playerDataState.playerId, game_id: gameId };
        await deleteData(RestApiEndpoint.PlayerGames, requestBody);
        gameDataDispatch({ type: LEAVE_GAME })
    });

    useEffect(() => {
        const fetch = async () => fetchData(`${RestApiEndpoint.Games}/${gameId}`);
        const results = fetch()
        gameDataDispatch({ type: UPDATE_CURRENT_GAME, gameData: results.data });
    }, [gameDataDispatch, gameId]);

    return (
        <>
            <p>{gameId}</p>
            <p>{playerDataState.playerName}</p>
        </>
    )
};

export default Game;