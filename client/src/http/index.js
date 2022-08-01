import axios from 'axios';

/*export const APP_URL = 'http://localhost:4000/';
export const GraphQL_URL = 'http://localhost:4000/graphql';
export const GraphQL_WS = 'ws://localhost:4000/graphql';*/

export const APP_URL = 'https://chat-server-graphql.herokuapp.com/';
export const GraphQL_URL = 'https://chat-server-graphql.herokuapp.com/graphql';
export const GraphQL_WS = 'wss://chat-server-graphql.herokuapp.com/graphql';

export const API_URL = APP_URL + "api";
export const API_URL_AVATAR = APP_URL + "api/userAvatar"
export const API_URL_MEDIA = {
    video: API_URL + "/messageMedia" + "/video",
    image: API_URL + "/messageMedia" + "/image",
    audio: API_URL + "/messageMedia" + "/audio",
}

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

export default $api;