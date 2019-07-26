import axios from 'axios';
import { 
    CREATE_MESSAGE_ROOM, 
    GET_MESSAGE_ROOM, 
    LOADING_MESSAGE_ROOM, 
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

// Get message room
export const getMessageRoom = (userId) => (dispatch) => {  
    dispatch(messageRoomLoading());
     
    axios.get(`/api/message/${userId}`)
        .then(res =>
            dispatch({
                type: GET_MESSAGE_ROOM,
                payload: res.data
            })
        )
        .catch(err => {
            if (err.response.status === 404) {
                console.log('couldnt find a room. make one');
            } else {
                window.M.toast({html: 'There was an error finding / opening the message room. Please try again ', classes: 'red lighten-2'});
            }
        });
}

// Create message room

// Clear all users
export const clearAllUsers = () => (dispatch) => {
    dispatch({
        type: CLEAR_ALL_USERS
    })
}

// Clear message room
export const clearMessageRoom = () => (dispatch) => {
    dispatch({
        type: CLEAR_MESSAGE_ROOM
    })
}

export const setAllUsersLoading = () => {
    return {
        type: LOADING_ALL_USERS
    }
}

export const messageRoomLoading = () => {
    return {
        type: LOADING_MESSAGE_ROOM
    }
}