import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import playlistReducer from './playlistReducer';
import accountReducer from './accountReducer';
import messengerReducer from './messengerReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    playlist: playlistReducer,
    account: accountReducer,
    messenger: messengerReducer
});