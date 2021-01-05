import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import { Typography, Box } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import { mapApiCardsToPngStrings, sortCards } from "../../util/cardUtils";
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

    const playerCards = gameDataState.currentGameData.details.player_cards[playerDataState.playerId];
    const numPlayerCards = playerCards.length;
    const sortedCards = sortCards(playerCards);

    const playerTurn = gameDataState.currentGameData.details.player_id_number_map[playerDataState.playerId];
    const currentTurn = gameDataState.currentGameData.details.current_turn;

    return (
        <>
            <Typography>{JSON.stringify(gameDataState.currentGameData)}</Typography>
            <CardsContainer>
                <div className={classes.container} style={{ gridTemplateColumns: `repeat(${numPlayerCards + 1}, 1fr)` }}>
                    {mapApiCardsToPngStrings(sortedCards).map((pngStr, idx) => (
                        <div style={{ gridColumn: `${idx + 1} / span 2`, gridRow: 1, zIndex: `${idx}` }}>
                            <PlayerCard pngStr={pngStr} currentTurn={currentTurn} playerTurn={playerTurn} />
                            {/*<img src={`/cards/${pngStr}`} style={{ height: '150px', width: '100px' }} alt={'Card png'} />*/}
                        </div>
                    ))}
                </div>
            </CardsContainer>
        </>
    )
};

export default GameInProgress;