import React, { Component } from 'react';
import { Chip } from 'react-materialize';

const CurrentUser = props => {
    return (
        <Chip className="currentUser">
            <img src={props.currentUser.avatar} alt='Current users avatar' />
            Current user: {props.currentUser.username}
        </Chip>
    )
}

export default CurrentUser;