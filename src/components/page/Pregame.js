import React, {useContext} from 'react';
import { styled } from "@material-ui/core/styles";
import { Box, Button, Card } from "@material-ui/core";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import {WsEndpoint} from "../../constants/apiConstants";

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
})

const Pregame = ({ players, isCreator, gameId }) => {
    const { sendMessage } = useContext(WebSocketContext);

    const startGame = (e) => {
        sendMessage(WsEndpoint.StartGameApp(gameId));
    }

    return (
        <Container>
            <PlayerBoxChatContainer>
                <PlayerListBox>
                    {players.map((player, idx) => (
                        <PlayerBox key={idx} border={1} variant="outlined" p={1}>
                            {player.name}
                        </PlayerBox>
                    ))}
                </PlayerListBox>
            </PlayerBoxChatContainer>
            {isCreator && (
                <Button onClick={startGame}>Start Game</Button>
            )}
        </Container>
    )
};

export default Pregame;