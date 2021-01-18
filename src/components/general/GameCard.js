import React from 'react';
import { Card, Box, Typography, Button } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

import { postData } from "../../util/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import { JOIN_GAME, RESET_GAME_DATA } from "../../reducer/gameDataReducer";

const CustomCard = styled(Card)({
    height: '100%',
    width: '100%'
});

const CardContainer = styled(Box)({
    width: '90%',
    height: '90%',
    margin: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const GameStatusTypography = styled(Typography)({
    textAlign: 'center'
})

const GameCard = ({ gameId, playerId, creatorName, numPlayers, inProgress, gameDataDispatch }) => {
    const history = useHistory();

    const joinGame = async (e) => {
        const requestBody = { player_id: playerId, game_id: gameId };
        const results = await postData(RestApiEndpoint.PlayerGames, requestBody);
        if (!results.error && results.responseCode === 200) {
            gameDataDispatch({ type: JOIN_GAME, currentGameId: gameId });
            history.push(`/games/${gameId}`)
        } else if (results.responseCode === 400) {
            window.location.reload(false);
        } else {
            gameDataDispatch({ type: RESET_GAME_DATA });
            history.push("/");
        }
    };

    const InProgressText = () => {
        if (numPlayers >= 8) return (<GameStatusTypography style={{ color: 'red' }}>Full</GameStatusTypography>)
        if (inProgress) return (<GameStatusTypography style={{ color: 'orange' }}>In progress...</GameStatusTypography>)
        return (<GameStatusTypography style={{ color: 'green' }}>Open</GameStatusTypography>)
    }

    const JoinButton = () => (inProgress || numPlayers >= 8)
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' onClick={joinGame} variant='contained'>Join Game</Button>;

    return (
        <CustomCard raised={true}>
            <CardContainer>
                <Typography variant={'h6'}>{creatorName}'s BS Game</Typography>
                <Typography>Number of players: {numPlayers}</Typography>
                <InProgressText />
                <JoinButton />
            </CardContainer>
        </CustomCard>
    )
};

export default GameCard;
