import React, { Component } from 'react'
import { Button, Row, Col } from 'react-materialize';

export default class Users extends Component {
    componentDidMount = () => {
        // this.instance = document.querySelector('#messengerUsers');
        // console.log(this.props.usersRef.current);
        // console.log(this.instance);
        
    }
    userClick = (e) => {
        // console.log(e);
        // const instance2 = window.M.Modal.getInstance(this.instance);
        // console.log(this.props.usersRef.current.instance.el);
        
        const instance = window.M.Modal.getInstance(this.props.usersRef.current.instance.el);
        // console.log(instance);
        
        instance.close();
    }
    render() {
        return (
            <div>
                <Row>
                    <Col><Button onClick={this.userClick} className="bg-green" waves="light">Daniel Blythe</Button></Col>
                </Row>
                <Row>
                    <Col><Button className="bg-green" waves="light">Liam Balcombe</Button></Col>
                </Row>
                <Row>
                    <Col><Button className="bg-grey" waves="light">Billy Wright</Button></Col>
                </Row>
                <Row>
                    <Col><Button className="bg-green" waves="light">Rosie Forsyth</Button>   </Col>
                </Row>
            </div>
        )
    }
}

