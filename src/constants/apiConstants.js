const API_LOCAL_BASE = "http://localhost:8080";
const API_PROD_BASE = "";

const BASE_URL = process.env.NODE_ENV === 'production' ? API_PROD_BASE : API_LOCAL_BASE

export const RestApiEndpoint = {
    Players: `${BASE_URL}/players`,
    Games: `${BASE_URL}/games`
};

export const WebsocketEndpoint = {

};