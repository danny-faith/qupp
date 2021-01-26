import axios from 'axios';
import { ifElse, type, both, is, not, tap } from 'ramda'

/**
 * use lensProp to get inside axios
 */

const setAuthToken = ifElse(
    is(String),
    (token) => axios.defaults.headers.common['Authorization'] = token,
    () => delete axios.defaults.headers.common['Authorization'],
)

export default setAuthToken;