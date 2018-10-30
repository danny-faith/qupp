import React, { Component } from 'react';
import {Row, Col, Button, Input } from 'react-materialize';
import axios from 'axios';

class RegisterForm extends Component {
    username = React.createRef();
    email = React.createRef(); 
    password = React.createRef();
    passwordRepeat = React.createRef();
    

    handleRegisterForm = event => {
        event.preventDefault();
        // console.log(this.password.current.state.value);
        const newUser = {
            username: this.username.current.state.value,
            email: this.email.current.state.value,
            password: this.password.current.state.value
        }
        axios.post('http://localhost:8080/user/', newUser)
            .then(function (response) {
                // console.log(response.data.errors.keys());
                // if errors set colour else blue or something
                const resData = response.data.errors;
                console.log(Object.keys(resData).forEach(key => {
                    window.M.toast({html: `${resData[key].path} ${resData[key].message}`, classes: 'red lighten-1'});
                }));                
            })
            .catch(function (err) {
                // as I dont send a status in server.js, axios doesnt realise theres an error and so it doesn get caught by the catch.
                // add status back in and figure out why you cant send a status and the err object `.status(400).send(err)` <- cant do that
                window.M.toast({html: 'catch error.data.message', classes: 'red lighten-1'});
            })
            .then(function (response) {
                // console.log('always run', response);
                // window.M.toast({html: 'response.data', classes: 'red lighten-1'});
            });
    }
    render() {
        return(
            <form onSubmit={this.handleRegisterForm}>
                <Row>
                    <Col s={12}>
                        <Input 
                            id={"username"}
                            defaultValue="DannyWobble"
                            validate={true}
                            type="text"
                            required
                            ref={this.username}
                            placeholder="Username"
                            s={12}
                            label="Username" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"email"}
                            defaultValue="daniel.e.blythe@gmail.com"
                            type="email"
                            required
                            ref={this.email}
                            placeholder="Email"
                            s={12}
                            label="Email" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"registerPassword"}
                            defaultValue="ggg"
                            type="password"
                            required
                            ref={this.password}
                            placeholder="Password"
                            s={12}
                            label="Password" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Input
                            id={"registerPasswordRepeat"}
                            defaultValue="ggg"
                            type="password"
                            required
                            ref={this.passwordRepeat}
                            placeholder="Password"
                            s={12}
                            label="Repeat password" />
                    </Col>
                </Row>
                <Row>
                    <Col s={12}>
                        <Button className="btn-small right" waves="light">Register</Button>
                    </Col>
                </Row>
            </form>
        )
    }
}

export default RegisterForm;