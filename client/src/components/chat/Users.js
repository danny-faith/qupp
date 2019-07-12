import React, { Component } from 'react'
import { Button, Row, Col } from 'react-materialize';

export default class Users extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col><Button className="bg-green" waves="light">Daniel Blythe</Button></Col>
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

