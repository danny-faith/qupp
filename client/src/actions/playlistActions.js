import axios from 'axios';
import { 
    GET_ERRORS, 
    PLAYLISTS_LOADING, 
    GET_PLAYLIST, 
    GET_PLAYLISTS,
    GET_ALL_PLAYLISTS,
    CLEAR_PLAYLISTS,
    CLEAR_PLAYLIST
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

// Get all playlists
export const getAllPlaylists = () => (dispatch) => {  
    dispatch(setPlaylistLoading());
     
    axios.get('/api/playlists/all')
        .then(res =>
            dispatch({
                type: GET_ALL_PLAYLISTS,
                payload: res.data
            })
        )
        .catch(err => console.log(err));
}

// Get specific playlist by playlist slug
export const getPlaylist = (slug) => (dispatch) => {
    
    axios.get(`/api/playlists/${slug}`)
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
            window.M.toast({html: (payload.id === null) ? 'Playlist created' : 'Playlist edited', classes: 'green lighten-2'})          
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

export const clearPlaylist = () => (dispatch) => {
    dispatch({
        type: CLEAR_PLAYLIST
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
        type: PLAYLISTS_LOADING
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