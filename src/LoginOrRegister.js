import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import logo from './logo-v2.svg';
import CurrentUser from './components/CurrentUser';


class LoginOrRegister extends Component {
    
    render() {
        return (
            <div className="container">
                <Row>
                    <Col s={12} className='center logo'><img src={logo} alt="qupp logo" /></Col>
                    <CurrentUser currentUser={this.props.currentUser} />
                </Row>
                <Row>
                    <Col s={12} l={4} offset={"l2"}>
                        <LoginForm setCurrentUser={this.props.setCurrentUser} />
                    </Col>
                    <Col s={12} l={4}>
                        <RegisterForm setCurrentUser={this.props.setCurrentUser} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default LoginOrRegister;
