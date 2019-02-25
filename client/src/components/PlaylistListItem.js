import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';

export default class PlaylistListItem extends Component {
  render() {
    return (
        <Row>
            <Col s={8}>
                <h5>Bugsy's House party</h5>
            </Col>
            <Col s={4}>
                <Button className="right" waves='light'><Icon>visibility</Icon></Button>
                <Button className="right yellow darken-3" waves='light'><Icon>edit</Icon></Button>
            </Col>
            <Col s={8}>
                <h5>xCvcFe45Fbfddy</h5>
            </Col>
            <Col s={4}>
                <Button className="right blue" waves='light'><Icon>file_copy</Icon></Button>
                <Button className="right pink lighten-2" waves='light'><Icon>share</Icon></Button>
            </Col>
        </Row>
    )
  }
}
