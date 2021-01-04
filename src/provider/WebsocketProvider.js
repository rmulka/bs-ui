import React, { createContext, useRef, useEffect, useState, useContext, useMemo } from 'react'
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useParams } from "react-router-dom";

import { WsEndpoint } from "../constants/apiConstants";
import Loading from "../components/loading/Loading";
import GameDataContext from "../context/GameDataContext";
import { UPDATE_CURRENT_GAME } from "../reducer/gameDataReducer";

const WebSocketContext = createContext(null)

export { WebSocketContext }

const WebsocketProvider = ({ children }) => {
    const { gameId } = useParams();

    const sockRef = useRef(null);
    const [sockActive, setSockActive] = useState(false);
    const { gameDataDispatch } = useContext(GameDataContext);

    const sendMessage = (url, payload, headers = {}) => {
        sockRef.current.send(url, headers, JSON.stringify(payload));
    }

    useEffect(() => {
        const socket = new SockJS(WsEndpoint.Registry);
        sockRef.current = Stomp.over(socket);
        sockRef.current.reconnectDelay = 1000;
        sockRef.current.heartbeatIncoming = 4000;
        sockRef.current.heartbeatOutgoing = 4000;
        sockRef.current.debug = (str) => {};
        sockRef.current.connect({}, (frame) => {
            console.log("Websocket connected");
            sockRef.current.subscribe(WsEndpoint.GameTopic(gameId), (data) => {
                console.log(JSON.parse(data.body));
                gameDataDispatch({ type: UPDATE_CURRENT_GAME, gameData: JSON.parse(data.body) })
            });
            setSockActive(true);
        });

        return () => sockRef.current.disconnect();
    }, [gameDataDispatch, gameId]);

    const ws = useMemo(() => ({
        ws: sockRef.current,
        sendMessage
    }), []);

    if (!sockActive) return <Loading />
    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebsocketProvider;