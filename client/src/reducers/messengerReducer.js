import { 
    CREATE_MESSAGE_ROOM, 
    GET_MESSAGE_ROOM, 
    MESSAGE_ROOM_LOADING, 
    CLEAR_MESSAGE_ROOM,
    GET_ALL_USERS,
    LOADING_ALL_USERS,
    CLEAR_ALL_USERS
} from '../actions/types';

const initialState = {
    users: null,
    loading: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_MESSAGE_ROOM:
            return {
                ...state
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