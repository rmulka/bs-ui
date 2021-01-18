import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { deleteData } from "../../util/apiHelper";
import { RestApiEndpoint, WsEndpoint } from "../../constants/apiConstants";
import { LEAVE_GAME } from "../../reducer/gameDataReducer";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import Loading from "../loading/Loading";
import GameInProgress from "./GameInProgress";
import Pregame from "./Pregame";
import usePopState from "../../hooks/usePopState";
import GameHeader from "../general/GameHeader";

const Container = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
})

const Game = () => {
    const { gameId } = useParams();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);
    const { sendMessage } = useContext(WebSocketContext);

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
            <Pregame players={gameDataState.currentGameData.players} gameId={gameId} />
        </Container>
    )
    return (
        <Container>
            <GameHeader />
            <GameInProgress />
        </Container>
    )
};

export default Game;