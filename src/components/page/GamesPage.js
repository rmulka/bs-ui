import React, { useContext, useEffect } from 'react';
import { Typography } from "@material-ui/core";

import GameDataContext from "../../context/GameDataContext";
import { LOADING, UPDATE_ALL_GAMES } from "../../reducer/gameDataReducer";
import { fetchData } from "../../http/apiHelper";
import { RestApiEndpoint } from "../../constants/apiConstants";
import Loading from "../loading/Loading";

const GamesPage = () => {
    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);

    useEffect(() => {
        gameDataDispatch({ type: LOADING });
        fetchData(RestApiEndpoint.Games).then(data => {
            gameDataDispatch({ type: UPDATE_ALL_GAMES, payload: data })
        })
    }, [gameDataDispatch]);

    const Games = () => {
        if (gameDataState.loading || gameDataState.startUp) {
            return <Loading/>
        }
        console.log(gameDataState.allGames);
        return (<Typography>hi</Typography>)
    }

    return <Games />
};

export default GamesPage;