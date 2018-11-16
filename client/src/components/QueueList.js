import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import { TransitionGroup, CSSTransition } from "react-transition-group";

class QueueList extends Component {

    handleRemoveSongFromPlayQueue = (key) => {
        this.props.removeSongFromPlayQueue(key);
    }

    renderOrder = key => {
        const track = this.props.playQueue[key];
        const transitionOptions = {
            classNames: "queue",
            key,
            timeout: { enter: 500, exit: 500 }
        };

        return (
            <CSSTransition {...transitionOptions}>
                <Row key={key}>
                    <Col s={6}>
                        <p>{track.name}</p>
                    </Col>
                    <Col s={4}>
                        <p>{track.artists[0].name}</p>
                        <p>{track.album}</p>
                    </Col>
                    <Col s={2}>
                        <Button className="btn-small right red lighten-2" waves="light" onClick={() => this.handleRemoveSongFromPlayQueue(key)} icon="remove"></Button>
                    </Col>
                </Row>
            </CSSTransition>
        );
    };

    render() {
        const trackIds = Object.keys(this.props.playQueue);
        return(
            <TransitionGroup component="div" className="queue queue-con">
                {trackIds.map(this.renderOrder)}
            </TransitionGroup>
        )
    }
}

export default QueueList;