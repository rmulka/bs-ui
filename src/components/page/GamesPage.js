import React, { useContext, useEffect } from 'react';
import { Grid, Box } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';

import GameDataContext from "../../context/GameDataContext";
import { LOADING, UPDATE_ALL_GAMES } from "../../reducer/gameDataReducer";
import { fetchData } from "../../http/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import Loading from "../loading/Loading";
import GameCard from "../general/GameCard";

const Container = styled(Box)({
    width: '70%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const ItemContainer = styled(Box)({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const GamesPage = () => {
    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);

    useEffect(() => {
        gameDataDispatch({ type: LOADING });
        fetchData(RestApiEndpoint.Games).then(data => {
            gameDataDispatch({ type: UPDATE_ALL_GAMES, payload: data.data });
        })
    }, [gameDataDispatch]);

    const Games = () => {
        if (gameDataState.loading || gameDataState.startUp) {
            return <Loading/>
        }
        return (
            <Container>
                <Grid container justify="center" spacing={6}>
                    {gameDataState.allGames.map((game) => (
                        <Grid key={game.id} item style={{ width: '30%', height: '250px' }}>
                            <GameCard creatorName={game.creatorName} gameId={game.id} numPlayers={game.numPlayers} inProgress={game.inProgress} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        )
    }

    return <Games />
};

export default GamesPage;