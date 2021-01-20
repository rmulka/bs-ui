import React, { useContext } from 'react';
import { styled } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";

import { WebSocketContext } from "../../provider/WebsocketProvider";
import { WsEndpoint } from "../../constants/apiConstants";
import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import LoadingDots from "../loading/LoadingDots";

const Container = styled(Box)({
    width: '75%',
    height: '75%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const PlayerBoxChatContainer = styled(Box)({
    width: '100%',
    height: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
});

const PlayerListBox = styled(Box)({
    width: '45%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const PlayerBox = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
});

const MessageBox = styled(Box)({
    width: 'fit-content',
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
});

const Pregame = ({ players, gameId }) => {
    const { sendMessage } = useContext(WebSocketContext);

    const { gameDataState } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);

    const isCreator = gameDataState.currentGameData.creator_id === playerDataState.playerId;
    const numPlayers = gameDataState.currentGameData.num_players;
    const atLeast3Players = numPlayers >= 3;

    const startGame = (e) => {
        sendMessage(WsEndpoint.StartGameApp(gameId));
    }

    return (
        <Container>
            <PlayerBoxChatContainer>
                <PlayerListBox>
                    <Typography variant={'h6'}>{numPlayers}/8</Typography>
                    {players.map((player, idx) => (
                        <PlayerBox key={idx} border={1} variant="outlined" p={1}>
                            {player.name}
                        </PlayerBox>
                    ))}
                </PlayerListBox>
            </PlayerBoxChatContainer>
            {!atLeast3Players && (
                <MessageBox>
                    <Typography style={{ fontSize: 20 }}>Waiting for {3 - numPlayers} more {(numPlayers === 2) ? 'player' : 'players'} to join</Typography>
                    <LoadingDots />
                </MessageBox>
            )}
            {atLeast3Players && !isCreator && (
                <MessageBox>
                    <Typography style={{ fontSize: 20 }}>Waiting for {gameDataState.currentGameData.creator_name} to start the game</Typography>
                    <LoadingDots />
                </MessageBox>
            )}
            {isCreator && (
                <Button disabled={!atLeast3Players} onClick={startGame}>Start Game</Button>
            )}
        </Container>
    )
};

export default Pregame;