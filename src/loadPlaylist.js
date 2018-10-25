import axios from 'axios';

var songs = {}

axios.get('http://localhost:8080/songs/'
    ).then((res) => {
        songs = res.data;
        console.log('songs: ', songs);
    });

export default songs;
