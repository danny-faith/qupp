import { 
    SET_CURRENT_USER, 
    FORGOT_PASSWORD_EMAIL_SEARCH, 
    VERIFY_USER_FOR_PASSWORD_RESET 
} from '../actions/types';

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
        case VERIFY_USER_FOR_PASSWORD_RESET:        
            return {
                ...state,
                email: action.payload,
                token: action.payload
            }
        default: 
            return state;
    }
}