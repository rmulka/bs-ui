export const EDIT_PLAYER_INFO = 'EDIT_PLAYER_INFO';
export const JOIN_GAME = 'JOIN_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';

const playerDataReducer = (state, action) => {
    switch (action.type) {
        case EDIT_PLAYER_INFO:
            return {
                ...state,
                playerId: action.playerId,
                playerName: action.playerName
            }
        case JOIN_GAME:
            return {
                ...state,
                inGame: true,
                gameId: action.gameId
            }
        case LEAVE_GAME:
            return {
                ...state,
                inGame: false,
                gameId: null
            }
        default:
            throw new Error(`Unsupported action ${action.type} in player data reducer`);
    }
};

export default playerDataReducer;