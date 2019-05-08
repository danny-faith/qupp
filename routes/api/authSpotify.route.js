const express = require('express');
const axios = require('axios');
const router = express.Router();
const Base64 = require('js-base64').Base64;

const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;

const CLIENT_ID_SECRET_64 = Base64.encode(CLIENT_ID + ':' + CLIENT_SECRET);

/* 
 * Create spotify axios instance
 */
const spotifyAxios = axios.create({
    baseURL: 'https://accounts.spotify.com/api/token',
    timeout: 1000,
    headers: {
        'Authorization': 'Basic ' + CLIENT_ID_SECRET_64,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        grant_type: 'client_credentials'
    }
});

/* 
 * Request token from Spotify API using above axios instance
 * and return the token in the res object methods
 */
router.get('/', (req, res) => {
    spotifyAxios.post()
        .then((response) => {
            res.status(200).json(response.data);
        })
        .catch((error) => {
            res.status(500).json(error);
        }
    );
});

module.exports = router;