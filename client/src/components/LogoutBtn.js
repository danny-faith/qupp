import React, { Component } from 'react';
import { Button } from 'react-materialize';

class LogoutBtn extends Component {
    logout = () => {
        this.props.updateLoginState(false);
    }
    render() {
        return(
            <Button onClick={this.logout}>Logout</Button>
        )
    }
}

export default LogoutBtn;