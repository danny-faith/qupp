import { 
    CREATE_PLAYLIST,
    GET_PLAYLIST,
    PLAYLIST_LOADING,
    PLAYLIST_NOT_FOUND,
    GET_PLAYLISTS
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
        case PLAYLIST_LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_PLAYLIST:
            return {
                ...state,
                playlist: action.payload
            }
        case GET_PLAYLISTS:
            return {
                ...state,
                playlists: action.payload
            }
        default: 
            return state;
    }
}