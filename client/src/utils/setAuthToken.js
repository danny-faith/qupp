import axios from 'axios';
import { ifElse, is } from 'ramda'

const setAuthToken = ifElse(
    is(String),
    (token) => axios.defaults.headers.common.Authorization = token,
    () => delete axios.defaults.headers.common.Authorization,
)

export default setAuthToken
