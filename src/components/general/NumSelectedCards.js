import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Typography } from "@material-ui/core";

const NumSelectedCards = forwardRef(({ rank }, ref) => {
    const [numSelectedCards, setNumSelectedCards] = useState(0);
    useImperativeHandle(ref, () => ({ setNumCards: (num) => setNumSelectedCards(num) }), [setNumSelectedCards]);

    return (
        <Typography>{numSelectedCards} {rank}'s</Typography>
    )
});

export default NumSelectedCards;