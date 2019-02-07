import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => (dispatch) => {
    axios.post('/api/users/register', userData)
      .then(() => history.push('/login'))
      .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    });
}

// Login - get user token
export const loginUser = (userData) => (dispatch) => {
    axios.post('/api/users/login', userData)
        .then(res => {
            const { token } = res.data;
            // Set token to localstorage
            localStorage.setItem('jwtToken', token);
            // Set auth token to header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//  Log user out
export const logoutUser = () => (dispatch) => {
    // Remove token from localstorage
    localStorage.removeItem('jwtToken');
    // Remove authheader for future requests
    setAuthToken(false);
    // Set the current user to empty object which will also set isAuthenticated
    dispatch(setCurrentUser({}));
}