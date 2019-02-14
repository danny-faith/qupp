import { SET_CURRENT_USER, FORGOT_PASSWORD_EMAIL_SEARCH } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        case FORGOT_PASSWORD_EMAIL_SEARCH:
            return {
                ...state,
                email: action.payload
            }
        default: 
            return state;
    }
}