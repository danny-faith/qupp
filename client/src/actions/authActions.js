import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, PASSWORD_UPDATE_SUCCESS } from './types';

// Register User
export const registerUser = (userData, history) => (dispatch) => {
    axios.post('/api/users/register', userData)
      .then(() => {
          window.M.toast({ html: 'Account successfully created', classes: 'green lighten-2' });
          history.push('/login')
        })
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
            const { token, firebaseToken } = res.data;
            
            // Set tokens to localstorage
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('firebaseToken', firebaseToken);
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

// Upload avatar image
export const uploadAvatarImage = (formData) => (dispatch) => {  
    
    axios.post('/api/users/avatar', formData)
        .then(res => {
            window.M.toast({html: `Avatar successfully uploaded`, classes: 'green lighten-2'});
            
            dispatch(resetJWT(res.data));
        })
        .catch(err => console.log(err));
}
    
export const resetJWT = (payload) => (dispatch) => {
    
    axios.post('/api/users/update-token', payload)
        .then(res => {

            // Set token to localstorage
            localStorage.setItem('jwtToken', res.data.token);
            // Set auth token to header
            setAuthToken(res.data.token);
            // Decode token to get user data
            const decoded = jwt_decode(res.data.token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => console.log(err));
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

// Should be called sendForgotPasswordEmail
export const forgotPasswordEmailSearch = (email) => (dispatch) => {
    axios.post('/api/users/forgot-password', email)
        .then(res => {
            window.M.toast({html: `Password reset email sent to:&nbsp;<strong>${res.data.email}</strong>`, classes: 'green lighten-2'});
        })
        .catch(err => {
            
            // This method of detecting if the error was the email service and not validation seems clunky
            if (err.response.data.hasOwnProperty('mailFailed')) {
                window.M.toast({html: "There was an error sending the email. Please try again.", classes: 'red lighten-1'});      
            }
            
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const changePassword = (payload) => (dispatch) => {
    // TODO User needs to be either logged out or re logged in automatically if they were already logged in
    axios.post(`/api/users/forgot-password-reset`, payload)
        .then(res => {
            // dispatch
            // Clear form fields and clear errors
            // console.log(res.data);
            // console.log('dispatch', dispatch);
            dispatch({
                type: PASSWORD_UPDATE_SUCCESS,
                payload: {
                    status: 'success',
                }
            });
            window.M.toast({html: `Password succesfully reset`, classes: 'green lighten-2'});            
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
            console.log(err);
        });
}

// Update user email and/or lastOnline
export const updateUserLastOnlineOrEmail = (payload) => () => {
    // console.log('payload: ', payload);
    
    axios.put(`/api/users/${payload.userId}`, payload)
        .then(() => {
            // do I need a .then() ?
            // TODO maybe dispatch in here to send news online/offline status to redux to re-render user colour in messenger
        })
        .catch(err => console.log(err));
}