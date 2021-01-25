import React, { useContext, useEffect, useRef } from "react";
import { styled, MuiThemeProvider } from '@material-ui/core/styles';
import { Typography, TextField, Box, Button } from "@material-ui/core";
import { useHistory } from 'react-router-dom';

import PlayerDataContext from "../../context/PlayerDataContext";
import { titleFont } from "../../theme/bsTheme";
import { RestApiEndpoint } from "../../constants/apiConstants";
import { postData } from "../../util/apiHelper";
import { EDIT_PLAYER_INFO, PLAYER_STORAGE_KEY, LOADING } from "../../reducer/playerDataReducer";
import { GAME_STORAGE_KEY } from "../../reducer/gameDataReducer";

const FONT_SIZE = '21.4285714285rem';

const CustomTextTypography = styled(Typography)({
    position: 'relative',
    textAlign: 'center',
    height: FONT_SIZE,
    width: '100%',
    marginBottom: `calc(${document.getElementById('aces').clientHeight}px - 4rem + 5%)`,
    zIndex: 1
});

const CustomImageTypography = styled(Typography)({
    textAlign: 'center',
    position: 'absolute',
    paddingTop: `calc(${FONT_SIZE} - 4rem)`,
    width: '100%',
    zIndex: 0
});

const CustomBox = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'fit-content',
    width: '100%'
});

const CustomButton = styled(Button)({
    marginLeft: '3em',
    height: '35%',
    width: '10%'
});

const NameEntryPage = () => {
    const history = useHistory();
    const { playerDataDispatch } = useContext(PlayerDataContext);
    const nameInputRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (nameInputRef.current.value.length > 0) {
            playerDataDispatch({ type: LOADING });
            history.push("/games");
            const requestBody = { name: nameInputRef.current.value };
            const result = await postData(RestApiEndpoint.Players, requestBody);
            playerDataDispatch({ type: EDIT_PLAYER_INFO, playerId: result.data.id, playerName: result.data.name });
        }
    };

    useEffect(() => {
        localStorage.removeItem(GAME_STORAGE_KEY);
        localStorage.removeItem(PLAYER_STORAGE_KEY);
    }, []);

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
            <MuiThemeProvider theme={titleFont}>
                <CustomImageTypography>
                    <img src={'/cards/aces.png'} width={'40%'} height={'40%'} alt={"Aces png"} id={"aces"} />
                </CustomImageTypography>
                <CustomTextTypography variant='h1'>BS</CustomTextTypography>
            </MuiThemeProvider>
            <CustomBox>
                <TextField
                    label="Enter your name"
                    color='secondary'
                    InputProps={{ style: { fontSize: 40, height: 85 } }}
                    InputLabelProps={{ style: { fontSize: 40, height: 100 } }}
                    inputRef={nameInputRef}
                />
                <CustomButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                >
                    Enter
                </CustomButton>
            </CustomBox>
        </form>
    )
};

export default NameEntryPage;