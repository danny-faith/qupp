import { 
    CREATE_PLAYLIST,
    GET_PLAYLIST,
    PLAYLISTS_LOADING,
    PLAYLIST_NOT_FOUND,
    GET_PLAYLISTS,
    GET_ALL_PLAYLISTS,
    CLEAR_PLAYLISTS,
    CLEAR_PLAYLIST
} from '../actions/types';

import isEmpty from '../validation/is-empty';

const initialState = {
    playlist: null,
    playlists: null,
    loading: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case CREATE_PLAYLIST:
            return {
                ...state
            }
        case PLAYLISTS_LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_PLAYLIST:
            return {
                ...state,
                playlist: action.payload,
                loading: false
            }
        case GET_PLAYLISTS:
            return {
                ...state,
                playlists: action.payload,
                loading: false
            }
        case GET_ALL_PLAYLISTS:
            return {
                ...state,
                playlists: action.payload,
                loading: false
            }
        case CLEAR_PLAYLISTS:
            return {
                ...state,
                playlists: {}
            }
        case CLEAR_PLAYLIST:
            return {
                ...state,
                playlist: {}
            }
        default: 
            return state;
    }
}