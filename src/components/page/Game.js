import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Typography, Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import useUnload from "../../hooks/useUnload";
import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { deleteData, fetchData } from "../../util/apiHelper";
import { RestApiEndpoint, WsEndpoint } from "../../constants/apiConstants";
import { LEAVE_GAME, UPDATE_CURRENT_GAME } from "../../reducer/gameDataReducer";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import Loading from "../loading/Loading";
import Pregame from "./Pregame";
import usePopState from "../../hooks/usePopState";
import GameHeader from "../general/GameHeader";

const Container = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
})

const Game = () => {
    const history = useHistory();
    const { gameId } = useParams();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);
    const { sendMessage } = useContext(WebSocketContext);

    const isCreator = gameDataState.currentGameData.creator_id === playerDataState.playerId;

    const leaveGame = async () => {
        const requestBody = { player_id: playerDataState.playerId, game_id: gameId };
        await deleteData(RestApiEndpoint.PlayerGames, requestBody);
        gameDataDispatch({ type: LEAVE_GAME });
    };

    usePopState(async e => {
        await leaveGame();
    })

    useEffect(() => {
        sendMessage(WsEndpoint.GameApp(gameId))
    }, [gameId, sendMessage]);

    if (!gameDataState.gameDataReceived) return <Loading />
    if (!gameDataState.currentGameData.in_progress) return (
        <Container>
            <GameHeader />
            <Pregame players={gameDataState.currentGameData.players} isCreator={isCreator} gameId={gameId} />
        </Container>
    )
    return (
        <Container>
            <GameHeader />
            <Typography>{JSON.stringify(gameDataState.currentGameData)}</Typography>
        </Container>
    )
};

export default Game;