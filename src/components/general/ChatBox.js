import React, { useState, useContext, useRef, useEffect } from 'react';
import { makeStyles, styled } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, IconButton } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import SendIcon from '@material-ui/icons/Send';

import { WebSocketContext } from "../../provider/WebsocketProvider";
import { WsEndpoint } from "../../constants/apiConstants";
import PlayerDataContext from "../../context/PlayerDataContext";
import { assignColors } from "../../util/styleUtils";

const TEXT_INPUT_HEIGHT = '1.1876em';

const ChatContainer = styled(Box)({
    width: '100%',
    height: '100%',
    padding: '3%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
});

const ChatMessagesContainer = styled(Box)({
    width: '94%',
    height: `calc(85% - ${TEXT_INPUT_HEIGHT})`,
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '5%',
    color: grey[50],
    overflowY: 'scroll',
    overflowX: 'scroll'
});

const MessageInputContainer = styled(Box)({
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const useStyles = makeStyles((theme) => ({
    textField: {
        background: grey[50],
        borderColor: grey[50],
        borderRadius: 8
    }
}));

const ChatBox = ({ players }) => {
    const classes = useStyles();

    const messageRef = useRef(null);

    const initialState = { messages: [] }
    const [messageState, setMessageState] = useState(initialState);

    const colors = useRef(assignColors(players));

    const { gameId } = useParams();

    const { playerDataState } = useContext(PlayerDataContext);
    const { sendMessage, ws } = useContext(WebSocketContext);

    useEffect(() => {
        ws.subscribe(WsEndpoint.ChatTopic(gameId), (data) => {
            setMessageState(JSON.parse(data.body));
        });
    }, [gameId, ws]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            player_id: playerDataState.playerId,
            message: messageRef.current.value
        }
        sendMessage(WsEndpoint.ChatApp(gameId), payload);
        messageRef.current.value = '';
    }

    return (
        <form onSubmit={handleSubmit} style={{ height: '100%', width: '100%' }}>
            <ChatContainer border={1} borderRadius={8} boxShadow={3} style={{ backgroundColor: '#222222' }}>
                <Typography style={{ height: '15%', color: grey[50] }} variant={'h5'}>Chat</Typography>
                <ChatMessagesContainer>
                    {messageState.messages.map(({ first, second }, idx) => {
                        const player = players.find(player => player.id === first);
                        return <Typography key={idx}><Box fontWeight='fontWeightBold' color={colors.current[player.id]} display='inline'>{player.name}:</Box> {second}</Typography>
                    })}
                </ChatMessagesContainer>
                <MessageInputContainer style={{ backgroundColor: '#222222' }}>
                    <TextField
                        style={{ flexGrow: 1 }}
                        id="message-box"
                        placeholder="Message"
                        variant="outlined"
                        InputProps={{ className: classes.textField }}
                        inputRef={messageRef}
                    />
                    <IconButton type="submit" aria-label="send" style={{ width: '25%' }} onClick={handleSubmit}>
                        <SendIcon style={{ color: grey[50] }} />
                    </IconButton>
                </MessageInputContainer>
            </ChatContainer>
        </form>

    )
};

export default ChatBox;