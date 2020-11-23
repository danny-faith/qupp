import { 
    CREATE_MESSAGE_ROOM, 
    GET_MESSAGE_ROOM, 
    LOADING_MESSAGE_ROOM, 
    CLEAR_MESSAGE_ROOM,
    GET_ALL_USERS,
    LOADING_ALL_USERS,
    CLEAR_ALL_USERS
} from '../actions/types';

const initialState = {
    users: null,
    loading: false,
    messageRoom: null
}

export default function(state = initialState, action) {
    switch (action.type) {
        case LOADING_MESSAGE_ROOM:
            return {
                ...state,
                loading: true
            }
        case GET_MESSAGE_ROOM:
            return {
                ...state,
                messageRoom: action.payload,
                loading: false
            }
        case CREATE_MESSAGE_ROOM:
            return {
                ...state,
                messageRoom: action.payload,
                loading: false
            }
        case CLEAR_MESSAGE_ROOM:
            return {
                ...state,
                messageRoom: {}
            }
        case LOADING_ALL_USERS:
            return {
                ...state,
                loading: true
            }
        case GET_ALL_USERS:
            return {
                ...state,
                users: action.payload,
                loading: false
            }
        case CLEAR_ALL_USERS:
            return {
                ...state,
                users: {}
            }
        default: 
            return state;
    }
}