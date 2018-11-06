import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
// import PropTypes from 'prop-types';

class PlaylistItem extends Component {
  
    deleteSongFromPlaylistHandler = () => {
        this.props.deleteSongFromPlaylist(this.props.data.spotId);
    }
    playSongHandler = () => {
        this.props.playSong(this.props.data.uri);
    }
    render() {
        let button;
        if (this.props.editMode) {
            button = <Button className="btn-small right red lighten-2" waves="light" onClick={this.deleteSongFromPlaylistHandler}>Delete</Button>;
        } else {
            button = <Button className="btn-small right" waves="light" onClick={this.playSongHandler}>Play</Button>;
        }
        return(
            <Row>
                <Col s={2}>
                    <img alt={'alt text'} src={this.props.data.image} />
                </Col>
                <Col s={6}>
                    <p>{this.props.data.name}, {this.props.data.album}</p>
                    <p>Artists:
                        {this.props.data.artists.map(key => (
                            <span key={key.name}> {key.name}</span>
                        ))}
                    </p>
                </Col>
                <Col s={4}>
                    {button}
                </Col>
            </Row>
        );
    }
}
  
export default PlaylistItem;