const express = require('express');
const axios = require('axios');
const router = express.Router();
const Base64 = require('js-base64').Base64;
require('dotenv').config();


const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;

const CLIENT_ID_SECRET_64 = Base64.encode(CLIENT_ID + ':' + CLIENT_SECRET);


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

router.get('/', (req, res) => {
    spotifyAxios.post()
        .then((response) => {
            // console.log(response.data.access_token);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            // console.log(error);
            res.status(500).json(error);
        }
    );
});

module.exports = router;