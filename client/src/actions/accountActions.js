import axios from 'axios';
import { 
    SET_CURRENT_USER,
} from './types';

// Get all playlists by current user
export const uploadAvatarImage = (formData) => (dispatch) => {  
    // console.log('formData: ', formData);
    
    // console.log(formData.entries());
    
    // for (var pair of formData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    // }
    axios.post('/api/users/avatar', formData)
        .then(res => {
            console.log('res: ', res);
            
            // dispatch({
            //     type: SET_CURRENT_USER,
            //     payload: res.data
            // })
        })
        .catch(err => console.log(err));
}
