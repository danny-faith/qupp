import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import playlistReducer from './playlistReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    playlist: playlistReducer
});