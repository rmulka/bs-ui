import React, { useContext } from 'react';
import { styled } from "@material-ui/core/styles";
import { Box, Grid, Button, withStyles, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from "react-router-dom";

import GameDataContext from "../../context/GameDataContext";
import { deleteData } from "../../util/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import { LEAVE_GAME } from "../../reducer/gameDataReducer";
import PlayerDataContext from "../../context/PlayerDataContext";
import { grey } from "@material-ui/core/colors";

const Container = styled(Box)({
    width: '100%',
    height: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'stretch'
});

const GridSpot = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
});

const ColorTypography = withStyles({
    root: {
        color: grey[300]
    }
})(Typography);

const GameHeader = () => {
    const history = useHistory();
    const { gameId } = useParams();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);

    const leaveGame = async (e) => {
        e.preventDefault();
        const requestBody = { player_id: playerDataState.playerId, game_id: gameId };
        await deleteData(RestApiEndpoint.PlayerGames, requestBody);
        gameDataDispatch({ type: LEAVE_GAME });
        history.goBack();
    };

    return (
        <Container>
            <Grid container direction='row' justify="center" spacing={0}>
                <Grid item xs={4}>
                    <GridSpot style={{ justifyContent: 'flex-start' }}>
                        <Button startIcon={<ArrowBackIcon />} style={{ marginLeft: '5%' }} onClick={leaveGame}>Leave Game</Button>
                    </GridSpot>
                </Grid>
                <Grid item xs={4}>
                    <GridSpot style={{ justifyContent: 'center' }}>
                        <ColorTypography>{gameDataState.currentGameData.creator_name}'s BS Game</ColorTypography>
                    </GridSpot>
                </Grid>
                <Grid item xs={4}>
                    <GridSpot style={{ justifyContent: 'flex-end' }}>
                        <ColorTypography style={{ marginRight: '5%' }}>{playerDataState.playerName}</ColorTypography>
                    </GridSpot>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GameHeader;