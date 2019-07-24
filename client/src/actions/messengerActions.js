import axios from 'axios';
import { 
    CREATE_MESSAGE_ROOM, 
    GET_MESSAGE_ROOM, 
    MESSAGE_ROOM_LOADING, 
    CLEAR_MESSAGE_ROOM,
    GET_ALL_USERS,
    LOADING_ALL_USERS,
    CLEAR_ALL_USERS
} from './types';

// Get all users
export const getAllUsers = () => (dispatch) => {  
    dispatch(setAllUsersLoading());
     
    axios.get('/api/users/all')
        .then(res =>
            dispatch({
                type: GET_ALL_USERS,
                payload: res.data
            })
        )
        .catch(err => console.log(err));
}

// Clear all users
export const clearAllUsers = () => (dispatch) => {
    dispatch({
        type: CLEAR_ALL_USERS
    })
}

export const setAllUsersLoading = () => {
    return {
        type: LOADING_ALL_USERS
    }
}