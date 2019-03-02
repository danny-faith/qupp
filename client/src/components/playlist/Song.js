import React from 'react';
import { Row, Col } from 'react-materialize';

export default function Song(props) {
  const classes = `${props.colour} py-3 darken-2 mb-0`;
  return (
    <Row className={classes}>
        <Col s={1} className="">
          <img src="http://placehold.it/100x100" className="w-full block" />
        </Col>
        <Col s={4} className="pl-0">
          <p className="my-0">When dove's cry</p>
        </Col>
        <Col s={3} className="pl-0">
          <p className="my-0">Prince's album</p>
        </Col>
        <Col s={3} className="pl-0">
          <p className="my-0">Prince, Someone</p>
        </Col>
    </Row>
  )
}
