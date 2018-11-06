import React, { Component } from 'react';
import { Button } from 'react-materialize';

class LogoutBtn extends Component {
    handleLogout = () => {
        this.props.updateLoginState(false);
    }
    render() {
        return(
            <Button onClick={this.handleLogout}>Logout</Button>
        )
    }
}

export default LogoutBtn;