export const LOADING = 'LOADING';
export const UPDATE_ALL_GAMES = 'UPDATE_ALL_GAMES';
export const JOIN_GAME = 'JOIN_GAME';
export const UPDATE_CURRENT_GAME = 'UPDATE_CURRENT_GAME';
export const LEAVE_GAME = 'LEAVE_GAME';
export const RESET_GAME_DATA = 'RESET_GAME_DATA';

export const GAME_STORAGE_KEY = 'gameData'

const gameDataReducer = (state, action) => {
    switch(action.type) {
        case LOADING:
            return { ...state, loading: true, startUp: false }
        case UPDATE_ALL_GAMES:
            return { ...state, loading: false, startUp: false, allGames: action.payload }
        case JOIN_GAME:
            return { ...state, loading: false, startUp: false, inGame: true, currentGameId: action.gameId }
        case UPDATE_CURRENT_GAME:
            return { ...state, loading: false, startUp: false, inGame: true, currentGameData: action.gameData }
        case LEAVE_GAME:
            return { ...state, loading: false, startUp: false, inGame: false, currentGameData: {}, currentGameId: null }
        case RESET_GAME_DATA:
            return { ...state, loading: false, startUp: true, allGames: {}, inGame: false, currentGameData: {}, currentGameId: null }
        default:
            throw new Error(`Unsupported action ${action.type} in game data reducer`);
    }
};

export default gameDataReducer;