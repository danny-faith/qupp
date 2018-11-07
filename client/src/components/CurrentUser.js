import React from 'react';
import { Chip } from 'react-materialize';
/**
 * 
 * @param {currentUser} props 
 */
const CurrentUser = props => {
    return (
        <Chip className="currentUser">
            <img src={props.currentUser.avatar} alt='Current users avatar' />
            Current user: {props.currentUser.username}
        </Chip>
    )
}

export default CurrentUser;