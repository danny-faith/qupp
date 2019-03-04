import axios from 'axios';
import { 
    GET_ERRORS, 
    PLAYLIST_LOADING, 
    GET_PLAYLIST, 
    GET_PLAYLISTS, 
    CLEAR_PLAYLISTS 
} from './types';

// Get all playlists by current user
export const getPlaylists = () => (dispatch) => {  
    dispatch(setPlaylistLoading());
     
    axios.get('/api/playlists')
        .then(res =>
            dispatch({
                type: GET_PLAYLISTS,
                payload: res.data
            })
        )
        .catch(err => console.log(err));
}

// Get specific playlist by playlist ID
export const getPlaylist = (playlist_id) => (dispatch) => {  
    // dispatch(setPlaylistLoading());
     
    axios.get(`/api/playlists/${playlist_id}`)
        .then(res =>
            dispatch({
                type: GET_PLAYLIST,
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

export const clearPlaylists = () => (dispatch) => {
    dispatch({
        type: CLEAR_PLAYLISTS
    })
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