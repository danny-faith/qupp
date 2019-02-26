import axios from 'axios';
import { GET_ERRORS, PLAYLIST_LOADING, GET_PLAYLIST } from './types';

export const createPlaylist = (payload) => (dispatch) => {
    console.log('createPlaylist: ', payload);
    axios.post('/api/playlists', payload)
        .then(res => {
            console.log(res.data);
            
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
            console.log(err);
        });
}

export const getCurrentPlaylist = () => dispatch => {
    dispatch(setPlaylistLoading());
    axios
        .get('/api/playlists')
        .then(res => 
            dispatch({
                type: GET_PLAYLIST,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PLAYLIST,
                payload : {}
            })
        )
}


export const setPlaylistLoading = () => {
    return {
        type: PLAYLIST_LOADING
    }
}