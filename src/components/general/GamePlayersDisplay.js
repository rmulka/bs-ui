import React, { useCallback } from 'react';
import { Box, Typography, withStyles } from '@material-ui/core';
import { styled } from "@material-ui/core/styles";
import { grey, red } from "@material-ui/core/colors";
import LensIcon from '@material-ui/icons/Lens';

const Container = styled(Box)({
    height: '125px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
})

const PlayerBox = styled(Box)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
})

const PlayerTurnStatusContainer = styled(Box) ({
    width: 'fit-content',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
})

const ColorTypography = withStyles({
    root: {
        color: grey[300]
    }
})(Typography);

const GamePlayersDisplay = ({ playerIdNumMap, playerOrder, playerCards, players, myUuid, currentTurn, currentMappedRank }) => {
    const uuidOrder = Object.values(playerOrder).map(orderNum =>
        Object.entries(playerIdNumMap).find(([id, num]) => orderNum === num)[0]);

    const myIndex = uuidOrder.findIndex(uuid => uuid === myUuid);

    const currentTurnUuid = Object.entries(playerIdNumMap).find(([id, num]) => num === currentTurn)[0]

    const getDisplayOrder = useCallback(() => {
        const order = [];
        let idx = (myIndex + 1) % uuidOrder.length;
        while (idx !== myIndex) {
            order.push(uuidOrder[idx]);
            idx = (idx + 1) % uuidOrder.length;
        }
        return order;
    }, [myIndex, uuidOrder]);

    const playerDisplayOrder = getDisplayOrder();

    return (
        <Container>
            {playerDisplayOrder.map(uuid => (
                <PlayerBox border={2} borderColor={grey[300]} borderRadius={16} key={uuid}>
                    <ColorTypography>
                        <Box fontSize={'h6.fontSize'} fontWeight={'fontWeightBold'}>
                            {players.find(player => player.id === uuid).name}
                        </Box>
                    </ColorTypography>
                    <ColorTypography>Cards: {playerCards[uuid].length}</ColorTypography>
                    {uuid === currentTurnUuid && (
                        <PlayerTurnStatusContainer>
                            <LensIcon style={{ color: red[700] }} />
                            <ColorTypography style={{ marginLeft: '1em' }}>On {currentMappedRank}'s</ColorTypography>
                        </PlayerTurnStatusContainer>
                    )}
                </PlayerBox>
            ))}
        </Container>
    )
};

export default GamePlayersDisplay;