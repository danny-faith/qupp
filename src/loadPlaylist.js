import axios from 'axios';

var songs = {}

axios.get('http://localhost:3333/songs/'
    ).then((res) => {
        songs = res.data;
        console.log('songs: ', songs);
    });

export default songs;
