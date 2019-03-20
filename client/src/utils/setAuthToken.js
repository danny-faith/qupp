import axios from 'axios';

const setAuthToken = (token) => {
    
    // console.log('axios default header: ', axios.defaults.headers.common);
    // console.log(localStorage.jwtToken === axios.defaults.headers.common['Authorization']);
    // console.log(localStorage.jwtToken);
    
    
    if (token) {
        // console.log('setAuthToken: ', token);
        
        // Apply token to every request
        // delete axios.defaults.headers.common['Authorization'];
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete/make sure no token is in header is token if no token exists
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;