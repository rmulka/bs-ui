import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Card, CardMedia } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

const Container = styled(Box)({
    width: '50%',
    height: '150px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
});

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

const Pile = ({ cards }) => {
    const PileDisplay = () => {
        if (cards.length === 0) return (
            <CustomCardBox border={3} borderColor={grey[900]} />
        )
        return (
            <CustomCardBox>
                <CardContainer>
                    <CustomCardMedia
                        src={'/cards/blue_back.png'}
                        component={'img'}
                    />
                </CardContainer>
            </CustomCardBox>
        )
    };

    return (
        <Container>
            <PileDisplay />
            <Typography style={{ marginLeft: '2em' }}>Pile: {cards.length}</Typography>
        </Container>
    )
};

Pile.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.shape({
        rank: PropTypes.number.isRequired,
        suit: PropTypes.number.isRequired
    })).isRequired
}

export default Pile;