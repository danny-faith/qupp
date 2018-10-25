import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Button, Input } from 'react-materialize';

class Login extends Component {
    usernameInput = React.createRef();
    passwordInput = React.createRef();
    handleFormSubmit = event => {
        event.preventDefault();
        const username = this.usernameInput.current.state.value;
        const password = this.passwordInput.current.state.value;

        console.log('username: ', username);
        console.log('password: ', password);
        const params = {
            username: username,
            password: password
        }
        axios({
            method: 'post',
            url: 'http://localhost:3333/login',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params: params
        })
        .then(res => {
          console.log(res);
          // SHOULD BE ERROR CATCHING IN HERE!!!
        })
        .catch(function (error) {
            console.log('error: ', error);
            console.log('error.config: ', error.config);
        });
    }
    render() {
        return (
            <Row>
                <form onSubmit={this.handleFormSubmit}>
                    <Col s={12}>
                        <Input id={"userName"} defaultValue='daniel8' ref={this.usernameInput} placeholder="is this even used" s={12} label="Username" />
                    </Col>
                    <Col s={12}>
                        <Input id={"password"} defaultValue='password' ref={this.passwordInput} placeholder="is this even used" s={12} label="Password" />
                    </Col>
                    <Col s={12}>
                        <Button waves="light" className="pink lighten-2">Login</Button>
                    </Col>
                </form>
            </Row>
        )
    }
}

export default Login;
