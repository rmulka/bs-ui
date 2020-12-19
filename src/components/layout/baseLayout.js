import React from "react";
import { styled } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import { BACKGROUND_LIGHT, BACKGROUND_DARK } from '../../theme/bsTheme';

const CustomContainer = styled(Container)({
    width: '100vw',
    height: '100vh'
})

const CustomTypography = styled(Typography)({
    background: `linear-gradient(0deg, ${BACKGROUND_LIGHT} 40%, ${BACKGROUND_DARK} 90%)`,
    height: '100vh',
    width: '100vw'
});

const BaseLayout = ({ children }) => {
    return (
        <CustomContainer disableGutters maxWidth={false}>
            <CustomTypography component="div">
                { children }
            </CustomTypography>
        </CustomContainer>
    )
};

export default BaseLayout;