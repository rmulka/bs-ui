import React, { useContext, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Typography, Box, Button } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import { mapApiCardsToPngStrings, mapRank, sortCards } from "../../util/cardUtils";
import PlayerCard from "../general/PlayerCard";
import NumSelectedCards from "../general/NumSelectedCards";
import { WsEndpoint } from "../../constants/apiConstants";
import SubmitTurnButton from "../general/SubmitTurnButton";

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

    const { gameDataState } = useContext(GameDataContext);
    const { playerDataState } = useContext(PlayerDataContext);
    const { sendMessage } = useContext(WebSocketContext);

    const selectedCards = useRef({});
    const numSelectedCardsRef = useRef();
    const submitTurnButtonRef = useRef();

    const gameDetails = gameDataState.currentGameData.details;

    const playerCards = gameDetails.player_cards[playerDataState.playerId];
    const numPlayerCards = playerCards.length;
    const sortedCards = sortCards(playerCards);

    const playerTurn = gameDetails.player_id_number_map[playerDataState.playerId];
    const currentTurn = gameDetails.player_order[gameDetails.current_turn];
    const currentTurnId = Object.entries(gameDetails.player_id_number_map).find(([key, value]) => value === currentTurn)[0];
    const currentTurnName = gameDataState.currentGameData.players.find(player => player.id === currentTurnId).name;

    const currentRank = gameDetails.current_rank;
    const currentCardDisplay = gameDetails.first_turn ? 'A of Spades' : `${mapRank(currentRank)}'s`;

    const selectCard = (idx) => {
        selectedCards.current[idx] = sortedCards[idx];
        const numCards = Object.keys(selectedCards.current).length;
        numSelectedCardsRef.current.setNumCards(numCards);
        if (gameDetails.first_turn) {
            if (numCards !== 1 || Object.values(selectedCards.current)[0].rank !== 1  || Object.values(selectedCards.current)[0].suit !== 1) {
                submitTurnButtonRef.current.setDisabled(true);
            } else {
                submitTurnButtonRef.current.setDisabled(false);
            }
        }
        else if (numCards > 0) submitTurnButtonRef.current.setDisabled(false);
    };

    const removeCard = (idx) => {
        delete selectedCards.current[idx];
        const numCards = Object.keys(selectedCards.current).length;
        numSelectedCardsRef.current.setNumCards(numCards);
        if (gameDetails.first_turn) {
            if (numCards === 1 && Object.values(selectedCards.current)[0].rank === 1  && Object.values(selectedCards.current)[0].suit === 1) {
                submitTurnButtonRef.current.setDisabled(false);
            } else {
                submitTurnButtonRef.current.setDisabled(true);
            }
        }
        else if (numCards === 0) submitTurnButtonRef.current.setDisabled(true);
    };

    const useTurn = (e) => {
        const payload = {
            player_id: playerDataState.playerId,
            played_cards: Object.values(selectedCards.current),
            remaining_cards: playerCards.filter(card => !Object.values(selectedCards.current).includes(card))
        };

        selectedCards.current = {};

        sendMessage(WsEndpoint.GameUpdateApp(gameId), payload);

        numSelectedCardsRef.current.setNumCards(0);
    }

    return (
        <>
            <Typography>{currentTurnName}'s turn to play {currentCardDisplay}</Typography>
            {currentTurn === playerTurn && (
                <>
                    <NumSelectedCards ref={numSelectedCardsRef} rank={mapRank(currentRank)} />
                    <SubmitTurnButton ref={submitTurnButtonRef} onClick={useTurn} />
                </>

            )}
            <CardsContainer>
                <div className={classes.container} style={{ gridTemplateColumns: `repeat(${numPlayerCards + 1}, 1fr)` }}>
                    {mapApiCardsToPngStrings(sortedCards).map((pngStr, idx) => (
                        <div style={{ gridColumn: `${idx + 1} / span 2`, gridRow: 1, zIndex: `${idx}` }} key={idx}>
                            <PlayerCard
                                pngStr={pngStr}
                                currentTurn={currentTurn}
                                playerTurn={playerTurn}
                                selectCard={selectCard}
                                removeCard={removeCard}
                                idx={idx}
                            />
                        </div>
                    ))}
                </div>
            </CardsContainer>
        </>
    )
};

export default GameInProgress;