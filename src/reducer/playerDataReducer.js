export const LOADING = 'LOADING';
export const EDIT_PLAYER_INFO = 'EDIT_PLAYER_INFO';
export const RESET_PLAYER_DATA = 'RESET_PLAYER_DATA';

export const PLAYER_STORAGE_KEY = 'playerData';

const playerDataReducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true, playerId: null, playerName: null }
        case EDIT_PLAYER_INFO:
            return { ...state, loading: false, playerId: action.playerId, playerName: action.playerName }
        case RESET_PLAYER_DATA:
            return { ...state, loading: false, playerId: null, playerName: null }
        default:
            throw new Error(`Unsupported action ${action.type} in player data reducer`);
    }
};

export default playerDataReducer;