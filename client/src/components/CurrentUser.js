import React from 'react';
import { Chip } from 'react-materialize';
/**
 * 
 * @param {currentUser} props 
 * <img src={'props.currentUser.avatar'} alt='Current users avatar' />
 * Current user: {props.currentUser.username}
 * 
 * 
 */
const CurrentUser = props => {
    return (
        <Chip className="currentUser">
            <img
                src={'https://bodiezpro.com/wp-content/uploads/2015/09/medium-default-avatar.png'}
                alt='Current users avatar'
            />
            Current user: {'Default username'}
        </Chip>
    )
}

export default CurrentUser;