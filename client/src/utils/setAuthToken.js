import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
        // Apply token to every request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete/make sure no token is in header is token if no token exists
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;