import React, { useContext, useEffect } from 'react';
import { Grid, Box, Button, Typography } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import {GAME_STORAGE_KEY, JOIN_GAME, LOADING, RESET_GAME_DATA, UPDATE_ALL_GAMES} from "../../reducer/gameDataReducer";
import {PLAYER_STORAGE_KEY, RESET_PLAYER_DATA} from "../../reducer/playerDataReducer";
import { fetchData, postData } from "../../util/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import Loading from "../loading/Loading";
import GameCard from "../general/GameCard";
import usePopState from "../../hooks/usePopState";

const Container = styled(Box)({
    width: '70%',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
});

const ButtonContainer = styled(Box)({
    width: '100%',
    height: '15%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const GamesPage = () => {
    const history = useHistory();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState, playerDataDispatch } = useContext(PlayerDataContext);

    usePopState(e => {
        e.preventDefault();
        localStorage.removeItem(GAME_STORAGE_KEY);
        localStorage.removeItem(PLAYER_STORAGE_KEY);
    })

    useEffect(() => {
        if (playerDataState.playerId === null && !playerDataState.loading) {
            playerDataDispatch({ type: RESET_PLAYER_DATA });
            history.push("/")
        }

        const fetch = async () => {
            gameDataDispatch({ type: LOADING });
            const results = await fetchData(RestApiEndpoint.Games);
            if (!results.error && results.responseCode === 200) {
                gameDataDispatch({ type: UPDATE_ALL_GAMES, payload: results.data });
            } else {
                gameDataDispatch({ type: RESET_GAME_DATA });
                history.push("/");
            }
        }

        fetch();
    }, [gameDataDispatch, history, playerDataDispatch, playerDataState.playerId]);

    const handleCreateClick = async (e) => {
        const gameData = await postData(RestApiEndpoint.Games, {}, playerDataState.playerId);
        const requestBody = { player_id: playerDataState.playerId, game_id: gameData.data };
        const results = await postData(RestApiEndpoint.PlayerGames, requestBody)
        if (!results.error && results.responseCode === 200) {
            gameDataDispatch({ type: JOIN_GAME, currentGameId: gameData.data });
            history.push(`/games/${gameData.data}`)
        } else {
            gameDataDispatch({ type: RESET_GAME_DATA });
            history.push("/");
        }
    };

    const GameCardsDisplay = () => {
        if (Object.keys(gameDataState.allGames).length === 0) {
            return <Typography variant={'h2'}>No games to show</Typography>
        }
        return (
            <Grid container justify="center" spacing={6}>
                {gameDataState.allGames.map((game) => (
                    <Grid key={game.id} item style={{ width: '30%', height: '250px' }}>
                        <GameCard
                            creatorName={game.creator_name}
                            playerId={playerDataState.playerId}
                            gameId={game.id}
                            numPlayers={game.num_players}
                            inProgress={game.in_progress}
                            gameDataDispatch={gameDataDispatch}
                        />
                    </Grid>
                ))}
            </Grid>
        )
    }

    const Games = () => {
        if (playerDataState.loading || gameDataState.loading || gameDataState.startUp) {
            return <Loading/>
        }
        return (
            <Container>
                <GameCardsDisplay />
                <ButtonContainer>
                    <Button onClick={handleCreateClick}>Create Game</Button>
                </ButtonContainer>
            </Container>
        )
    }

    return <Games />
};

export default GamesPage;