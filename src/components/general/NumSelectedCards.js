import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Typography } from "@material-ui/core";

const NumSelectedCards = forwardRef(({ rank }, ref) => {
    const [numSelectedCards, setNumSelectedCards] = useState(0);
    useImperativeHandle(ref, () => ({ setNumCards: (num) => setNumSelectedCards(num) }), [setNumSelectedCards]);

    const sIfNeeded = (numSelectedCards !== 1) ? '\'s' : ''

    return (
        <Typography>{numSelectedCards} {rank}{sIfNeeded} selected</Typography>
    )
});

export default NumSelectedCards;