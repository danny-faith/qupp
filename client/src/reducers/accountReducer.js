import { 
    SET_AVATAR_IMAGE,
} from '../actions/types';

const initialState = {
    avatar: null
}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_AVATAR_IMAGE:
            return {
                ...state,
                avatar: action.payload
            }
        default: 
            return state;
    }
}