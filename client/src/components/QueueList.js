import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';

class QueueList extends Component {
    handleRemoveSongFromPlayQueue = () => {
        this.props.removeSongFromPlayQueue(this.props.index);
    }
    render() {
        return(
            <Row>
                <Col s={6}>
                    <p>{this.props.data.name}</p>
                </Col>
                <Col s={4}>
                    <p>{this.props.data.artists[0].name}</p>
                    <p>{this.props.data.album}</p>
                </Col>
                <Col s={2}>
                    <Button className="btn-small right red lighten-2" waves="light" onClick={this.handleRemoveSongFromPlayQueue} icon="remove"></Button>
                </Col>
            </Row>
        )
    }
}

export default QueueList;