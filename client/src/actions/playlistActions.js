import axios from 'axios';
import { GET_ERRORS, PLAYLIST_LOADING, GET_PLAYLIST, GET_PLAYLISTS } from './types';

export const getPlaylists = () => (dispatch) => {        
    axios.get('/api/playlists')
        .then(res => 
            dispatch({
                type: GET_PLAYLISTS,
                payload: res.data
            })
        )
        .catch(err => console.log(err));
}

export const createPlaylist = (payload) => (dispatch) => {
    axios.post('/api/playlists', payload)
        .then(res => {
            dispatch(getPlaylists());            
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
            console.log(err);
        });
}

// export const getCurrentPlaylist = () => dispatch => {
//     dispatch(setPlaylistLoading());
//     axios
//         .get('/api/playlists')
//         .then(res => 
//             dispatch({
//                 type: GET_PLAYLIST,
//                 payload: res.data
//             })
//         )
//         .catch(err => 
//             dispatch({
//                 type: GET_PLAYLIST,
//                 payload : {}
//             })
//         )
// }


export const setPlaylistLoading = () => {
    return {
        type: PLAYLIST_LOADING
    }
}

export const deletePlaylist = (playlistId) => (dispatch) => {
    axios.delete(`/api/playlists/${playlistId}`)
        .then(() => {
            dispatch(getPlaylists());
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
            console.log(err);
        });
}