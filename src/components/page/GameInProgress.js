import React, {useContext, useEffect, useRef} from 'react';
import { useParams } from "react-router-dom";
import { Typography, Box, Button, withStyles, TextField } from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import GameDataContext from "../../context/GameDataContext";
import PlayerDataContext from "../../context/PlayerDataContext";
import { WebSocketContext } from "../../provider/WebsocketProvider";
import { mapApiCardsToPngStrings, mapRank, sortCards } from "../../util/cardUtils";
import PlayerCard from "../general/PlayerCard";
import NumSelectedCards from "../general/NumSelectedCards";
import { WsEndpoint } from "../../constants/apiConstants";
import SubmitTurnButton from "../general/SubmitTurnButton";
import Pile from "../general/Pile";
import GamePlayersDisplay from "../general/GamePlayersDisplay";
import { red, grey } from "@material-ui/core/colors";
import LensIcon from '@material-ui/icons/Lens';
import ChatBox from "../general/ChatBox";

const GameContainer = styled(Box)({
    width: '100%',
    height: '92%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
});

const CardsContainer = styled(Box)({
    width: '90%',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '1%'
});

const CenterContainer = styled(Box)({
    width: '40%',
    minHeight: '40%',
    flexGrow: 1,
    padding: '1.5% 0 1.5% 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
});

const TurnButtonsContainer = styled(Box)({
    width: 'fit-content',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
});

const YourTurnMarker = styled(LensIcon)({
    position: 'absolute',
    bottom: 'calc(1% + 150px + 2%)',
    right: '25%',
    color: red[700],
    fontSize: 40
});

const ChatBoxContainer = styled(Box)({
    height: 'calc(100vh - calc(1% + 150px + 2%) - 7% - 8% - 125px - 7%)',
    width: '20%',
    position: 'absolute',
    top: '50%',
    marginTop: 'calc((100vh - calc(1% + 150px + 2%) - 8% - 125px - 5%) / -2)',
    right: '5%'
});

const RedColorTypography = withStyles({
    root: {
        color: red[800]
    }
})(Typography);

const TextFieldTimeDisplay = withStyles({
    root: {
        position: 'absolute',
        bottom: '50%',
        left: '10%',
        "& .MuiInputBase-root.Mui-disabled": {
            color: grey[50],
            fontSize: 50
        }
    }
})(TextField);

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
    const timer = useRef(-1);
    const timerDisplayRef = useRef();

    const gameDetails = gameDataState.currentGameData.details;

    const playerCards = gameDetails.player_cards[playerDataState.playerId];
    const numPlayerCards = playerCards.length;
    const sortedCards = sortCards(playerCards);

    const playerTurn = gameDetails.player_id_number_map[playerDataState.playerId];
    const currentTurn = gameDetails.player_order[gameDetails.current_turn];

    const pile = gameDetails.pile;

    const currentRank = gameDetails.current_rank;
    const currentCardDisplay = gameDetails.first_turn ? 'A of Spades' : `${mapRank(currentRank)}'s`;

    const prevTurnUuid = gameDetails.first_turn ? null : gameDetails.player_number_id_map[gameDetails.player_order[gameDetails.prev_turn]];
    const prevTurnPlayer = gameDataState.currentGameData.players.find(player => player.id === prevTurnUuid);

    const winnerId = gameDetails.winner_id;
    const winnerName = winnerId ? gameDataState.currentGameData.players.find(player => player.id === winnerId).name : '';

    clearTimeout(timer.current);

    useEffect(() => {
        if (!gameDetails.first_turn && !gameDetails.is_winner) {
            const timerUntil = moment(gameDataState.currentGameData.timer_start).add(2, 'minutes').add(2, 'seconds');

            timer.current = setInterval(() => {
                const currentTime = moment();
                console.log(`current time: ${currentTime}`);
                console.log(`timerUntil: ${timerUntil}`);
                if (currentTime >= timerUntil) {
                    clearInterval(timer.current);
                    // send message to pick up pile
                    if (playerDataState.playerId === gameDetails.player_number_id_map[currentTurn]) {
                        sendMessage(WsEndpoint.MissedTurnApp(gameId, playerDataState.playerId));
                    }
                } else {
                    timerDisplayRef.current.value = moment(timerUntil.diff(currentTime)).format('m:ss');
                }
            }, 1000);

            return () => clearTimeout(timer.current);
        }
    }, [currentTurn, gameDataState.currentGameData.timer_start, gameDetails.first_turn, gameDetails.is_winner, gameDetails.player_number_id_map, gameId, playerDataState.playerId, sendMessage])

    const lastTurnMessage = () => {
        if (gameDetails.bs_called) {
            const youCalledBs = gameDetails.player_called_bs_id === playerDataState.playerId;
            const youGotBs = gameDetails.bs_player_id === playerDataState.playerId;
            const nameThatGotCalled = gameDataState.currentGameData.players.find(player => player.id === gameDetails.bs_player_id).name;
            const nameThatCalled = gameDataState.currentGameData.players.find(player => player.id === gameDetails.player_called_bs_id).name;
            if (gameDetails.is_bs) return (youCalledBs ? 'You' : nameThatCalled) + ' called ' + (youGotBs ? 'your' : `${nameThatGotCalled}'s`) + ' BS!';
            else return (youCalledBs ? 'You' : nameThatCalled) + ' called BS on ' + (youGotBs ? 'you' : nameThatGotCalled) +
                ' and ' + (youCalledBs ? 'were' : 'was') + ' wrong!';
        }
        else if (gameDetails.num_cards_last_played === 0 && !gameDetails.first_turn) {
            const yourTurn = playerDataState.playerId === prevTurnUuid;
            return (yourTurn ? 'You' : prevTurnPlayer.name) + ' missed ' + (yourTurn ? 'your' : 'their') + ' turn :(';
        }
        else if (pile.length > 0) {
            const prevPlayerName = playerDataState.playerId === prevTurnUuid ? 'You' : prevTurnPlayer.name;
            return `${prevPlayerName} played ${gameDetails.num_cards_last_played} ${mapRank(gameDetails.last_played_rank)}` +
                ((gameDetails.num_cards_last_played > 1) ? '\'s' : '')
        }
        return '';
    }

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
        submitTurnButtonRef.current.setDisabled(true);
    }

    const callBs = (e) => {
        const payload = { player_id: playerDataState.playerId };
        sendMessage(WsEndpoint.GameBsApp(gameId), payload);
    }

    const startGame = (e) => {
        sendMessage(WsEndpoint.StartGameApp(gameId));
    }

    const TurnOptions = () => {
        if (currentTurn === playerTurn) return (
            <>
                <NumSelectedCards ref={numSelectedCardsRef} rank={mapRank(currentRank)} />
                <TurnButtonsContainer>
                    <Button style={{ marginRight: '1em' }} disabled={gameDetails.bs_called || gameDetails.first_turn} onClick={callBs}>Call BS!</Button>
                    <SubmitTurnButton ref={submitTurnButtonRef} onClick={useTurn} />
                </TurnButtonsContainer>
            </>
        )
        else if (playerDataState.playerId !== prevTurnUuid && gameDetails.pile.length > 0) return (
            <Button disabled={gameDetails.bs_called} onClick={callBs}>Call BS!</Button>
        )
        return <></>
    }

    return (
        <GameContainer>
            <GamePlayersDisplay
                playerIdNumMap={gameDetails.player_id_number_map}
                playerOrder={gameDetails.player_order}
                playerCards={gameDetails.player_cards}
                myUuid={playerDataState.playerId}
                players={gameDataState.currentGameData.players}
                currentTurn={currentTurn}
                currentMappedRank={mapRank(currentRank)}
            />
            <TextFieldTimeDisplay
                InputProps={{ disableUnderline: true }}
                disabled
                variant={'standard'}
                inputRef={timerDisplayRef}
            />
            <ChatBoxContainer>
                <ChatBox players={gameDataState.currentGameData.players} />
            </ChatBoxContainer>
            {!gameDetails.is_winner && (
                <CenterContainer>
                    {playerTurn === currentTurn && (
                        <Typography>
                            <Box fontSize={'h5.fontSize'} fontWeight={'fontWeightBold'}>Your turn to play {currentCardDisplay}</Box>
                        </Typography>
                    )}
                    <Typography variant={'h5'}>{lastTurnMessage()}</Typography>
                    <Pile cards={pile} style={{ margin: '0.5em 0 0.5em 0' }} />
                    <TurnOptions />
                </CenterContainer>
            )}
            {gameDetails.is_winner && (
                <>
                    <RedColorTypography>
                        <Box fontSize={'h2.fontSize'} fontWeight={'fontWeightBold'}>
                            {(winnerId === playerDataState.playerId) && (
                                'You win!'
                            )}
                            {(winnerId !== playerDataState.playerId) && (
                                `${winnerName} wins!`
                            )}
                        </Box>
                    </RedColorTypography>
                    {gameDataState.currentGameData.creator_id === playerDataState.playerId && (
                        <Button onClick={startGame}>New Game</Button>
                    )}
                </>
            )}
            {playerTurn === currentTurn && (<YourTurnMarker />)}
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
        </GameContainer>
    )
};

export default GameInProgress;