import React, { useContext, useEffect } from 'react';
import { Grid, Box, Button } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import {JOIN_GAME, LOADING, UPDATE_ALL_GAMES} from "../../reducer/gameDataReducer";
import { RESET_PLAYER_DATA } from "../../reducer/playerDataReducer";
import { fetchData, postData } from "../../util/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import Loading from "../loading/Loading";
import GameCard from "../general/GameCard";
import useUnload from "../../hooks/useUnload";

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

    useUnload(e => {
        e.preventDefault();
        playerDataDispatch({ type: RESET_PLAYER_DATA })
    })

    useEffect(() => {
        if (playerDataState.playerId === null) {
            playerDataDispatch({ type: RESET_PLAYER_DATA });
            history.push("/")
        }
        gameDataDispatch({ type: LOADING });
        fetchData(RestApiEndpoint.Games).then(data => {
            gameDataDispatch({ type: UPDATE_ALL_GAMES, payload: data.data });
        })
    }, [gameDataDispatch, history, playerDataDispatch, playerDataState.playerId]);

    const handleCreateClick = async (event) => {
        try {
            const gameData = await postData(RestApiEndpoint.Games, {}, playerDataState.playerId);
            const requestBody = { player_id: playerDataState.playerId, game_id: gameData.data };
            await postData(RestApiEndpoint.PlayerGames, requestBody)
            gameDataDispatch({ type: JOIN_GAME, currentGameId: gameData.data });
            history.push(`/games/${gameData.data}`)
        } catch (error) {
            console.log(error);
        }
    };

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
                <ButtonContainer>
                    <Button onClick={handleCreateClick}>Create Game</Button>
                </ButtonContainer>
            </Container>
        )
    }

    return <Games />
};

export default GamesPage;