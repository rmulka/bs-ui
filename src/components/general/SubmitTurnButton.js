import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Button } from "@material-ui/core";

const SubmitTurnButton = forwardRef(({ onClick }, ref) => {
    const [disabled, setDisabled] = useState(true);
    useImperativeHandle(ref, () => ({ setDisabled: (disabled) => setDisabled(disabled) }), []);

    return (
        <Button onClick={onClick} disabled={disabled}>Done!</Button>
    )
});

export default SubmitTurnButton;