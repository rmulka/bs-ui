import React from 'react';
import { Card, Box, Typography, Button } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';

const CustomCard = styled(Card)({
    height: '100%',
    width: '100%'
});

const CardContainer = styled(Box)({
    width: '-webkit-fill-available',
    height: '-webkit-fill-available',
    margin: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const GameStatusTypography = styled(Typography)({
    textAlign: 'center'
})

const GameCard = ({ gameId, creatorName, numPlayers, inProgress }) => {

    const InProgressText = () => {
        if (numPlayers >= 8) return (<GameStatusTypography style={{color: 'red'}}>full</GameStatusTypography>)
        if (inProgress) return (<GameStatusTypography style={{color: 'orange'}}>In progress...</GameStatusTypography>)
        return (<GameStatusTypography style={{color: 'green'}}>Open</GameStatusTypography>)
    }

    const JoinButton = () => (inProgress || numPlayers >= 8)
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' onClick={() => console.log(`clicked game ${gameId}`)} variant='contained'>Join Game</Button>;

    return (
        <CustomCard
            variant='outlined'
            raised={true}
        >
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
