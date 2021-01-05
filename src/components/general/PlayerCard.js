import React, { useState } from 'react';
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

const PlayerCard = ({ pngStr, playerTurn, currentTurn }) => {
    const [selected, setSelected] = useState(false);

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
                        onClick={e => {setSelected(!selected)}}
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