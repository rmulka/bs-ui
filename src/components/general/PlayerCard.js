import React, { useEffect, useState } from 'react';
import { ButtonBase, Card, CardMedia, Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { yellow } from '@material-ui/core/colors';

const CustomCardBox = styled(Box)({
    height: '150px',
    width: '100px'
});

const CardContainer = styled(Card)({
    height: '100%',
    width: '100%'
});

const CustomCardMedia = styled(CardMedia)({
    height: '100%',
    width: '100%'
});

const PlayerCard = ({ pngStr, playerTurn, currentTurn, selectCard, removeCard, idx }) => {
    const [selected, setSelected] = useState(false);

    const select = (e) => {
        if (selected) removeCard(idx);
        else selectCard(idx);
        setSelected(!selected);
    }

    useEffect(() => {
        setSelected(false);
    }, [currentTurn, pngStr])

    const CardBox = ({ children }) => {
        if (selected) {
            return (
                <CustomCardBox border={3} borderColor={yellow[800]}>
                    {children}
                </CustomCardBox>
            )
        }
        return (
            <CustomCardBox>
                {children}
            </CustomCardBox>
        )
    }

    if (playerTurn === currentTurn) {
        return (
            <CardBox>
                <CardContainer>
                    <ButtonBase
                        onClick={select}
                    >
                        <CustomCardMedia
                            src={`/cards/${pngStr}`}
                            component={'img'}
                        />
                    </ButtonBase>
                </CardContainer>
            </CardBox>
        )
    }

    return (
        <CardBox>
            <CardContainer>
                <CustomCardMedia
                    src={`/cards/${pngStr}`}
                    component={'img'}
                />
            </CardContainer>
        </CardBox>
    )
}

export default PlayerCard;