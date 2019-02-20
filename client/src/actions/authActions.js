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
export const logoutUser = (history) => (dispatch) => {
    // Remove token from localstorage
    localStorage.removeItem('jwtToken');
    // Remove authheader for future requests
    setAuthToken(false);
    // Set the current user to empty object which will also set isAuthenticated
    dispatch(setCurrentUser({}));
    // Send user back to landing once logged out
    history.push('/');
}

export const forgotPasswordEmailSearch = (email) => (dispatch) => {
    axios.post('/api/users/forgot-password', email)
        .then(res => {
            window.M.toast({html: `Password reset email sent to:&nbsp;<strong>${res.data.email}</strong>`, classes: 'green lighten-2'})
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

export const verifyPasswordResetRequest = (payload) => (dispatch) => {
    const { email, token } = payload;
    console.log('email: ', email);
    console.log('token: ', token);
    
    // Is the email-token binding valid
    // if successful then email exists/valid and token matches
    axios.post('/api/users/verify-password-reset', payload)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));


    // has the token expired
    // using decoded token, checked when token expired 

    // has the token been used
    // Check if token have been used

    // If all above pass, render password reset form by setting relevant state to true
    // Otherwise show relevant error to user
    // E.g token and email do not match
    // ... token has expired
    // ... Token has been used
    //  Use same ordering as validation file where the last one(validation) if the first to be checked in the above list

    // USE THE BELOW ORDER
    // Check if token has been used
    // Check if token has expired
    // Check if token and email match
    // Check if email is valid / exists
}