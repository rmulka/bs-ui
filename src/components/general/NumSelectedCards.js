import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Typography } from "@material-ui/core";

const NumSelectedCards = forwardRef(({ numCards, rank }, ref) => {
    const [numSelectedCards, setNumSelectedCards] = useState(numCards);
    useImperativeHandle(ref, () => ({ setNumCards: (num) => setNumSelectedCards(num) }), [setNumSelectedCards]);

    return (
        <Typography>{numSelectedCards} {rank}'s</Typography>
    )
});

export default NumSelectedCards;