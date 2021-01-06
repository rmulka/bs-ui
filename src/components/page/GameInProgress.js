import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import { Typography, Box } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import { mapApiCardsToPngStrings, mapRank, sortCards } from "../../util/cardUtils";
import PlayerCard from "../general/PlayerCard";

const CardsContainer = styled(Box)({
    width: '90%',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5
});

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'grid',
        gridTemplateRows: 1,
        gridGap: theme.spacing(0),
    }
}));

const GameInProgress = () => {
    const classes = useStyles();

    const { gameId } = useParams();

    const { gameDataState, gameDataDispatch } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);
    const { sendMessage } = useContext(WebSocketContext);

    const gameDetails = gameDataState.currentGameData.details;

    const playerCards = gameDetails.player_cards[playerDataState.playerId];
    const numPlayerCards = playerCards.length;
    const sortedCards = sortCards(playerCards);

    const playerTurn = gameDetails.player_id_number_map[playerDataState.playerId];
    const currentTurn = gameDetails.current_turn;
    const currentTurnId = Object.entries(gameDetails.player_id_number_map).find(([key, value]) => value === currentTurn)[0];
    const currentTurnName = gameDataState.currentGameData.players.find(player => player.id === currentTurnId).name;

    const currentRank = gameDetails.current_rank;

    return (
        <>
            <Typography>{currentTurnName}'s turn to play {mapRank(currentRank)}'s</Typography>
            <CardsContainer>
                <div className={classes.container} style={{ gridTemplateColumns: `repeat(${numPlayerCards + 1}, 1fr)` }}>
                    {mapApiCardsToPngStrings(sortedCards).map((pngStr, idx) => (
                        <div style={{ gridColumn: `${idx + 1} / span 2`, gridRow: 1, zIndex: `${idx}` }}>
                            <PlayerCard pngStr={pngStr} currentTurn={currentTurn} playerTurn={playerTurn} />
                        </div>
                    ))}
                </div>
            </CardsContainer>
        </>
    )
};

export default GameInProgress;