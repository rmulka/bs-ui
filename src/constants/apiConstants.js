const API_LOCAL_BASE = "http://localhost:8080";
const API_PROD_BASE = "";

const WS_LOCAL_BASE = "http://localhost:8081";
const WS_PROD_BASE = "";

export const API_BASE_URL = process.env.NODE_ENV === 'production' ? API_PROD_BASE : API_LOCAL_BASE
export const WS_BASE_URL = process.env.NODE_ENV === 'production' ? WS_PROD_BASE : WS_LOCAL_BASE

export const RestApiEndpoint = {
    Players: `${API_BASE_URL}/players`,
    Games: `${API_BASE_URL}/games`,
    PlayerGames: `${API_BASE_URL}/games/players`
};

export const WsEndpoint = {
    Registry: `${WS_BASE_URL}/socket`,
    GameApp: (gameId) => `/app/game/details/${gameId}`,
    GameTopic: (gameId) => `/topic/game/${gameId}`,
    StartGameApp: (gameId) => `/app/game/start/${gameId}`,
    GameUpdateApp: (gameId) => `/app/game/turn/${gameId}`,
    GameBsApp: (gameId) => `/app/game/update/${gameId}/bs`
};