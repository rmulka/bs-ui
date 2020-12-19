export const EDIT_PLAYER_INFO = 'EDIT_PLAYER_INFO';
export const RESET_PLAYER_DATA = 'RESET_PLAYER_DATA';

export const PLAYER_STORAGE_KEY = 'playerData';

const playerDataReducer = (state, action) => {
    switch (action.type) {
        case EDIT_PLAYER_INFO:
            return { ...state, playerId: action.playerId, playerName: action.playerName }
        case RESET_PLAYER_DATA:
            return { ...state, playerId: null, playerName: null }
        default:
            throw new Error(`Unsupported action ${action.type} in player data reducer`);
    }
};

export default playerDataReducer;