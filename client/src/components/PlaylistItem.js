import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
// import PropTypes from 'prop-types';

class PlaylistItem extends Component {
  
    deleteSongFromPlaylistHandler = () => {
        // console.log('delete a song');
        this.props.deleteSongFromPlaylist(this.props.data.spotId);
    }
    playSongHandler = () => {
        // console.log('play a song', this.props.data);
        this.props.playSong(this.props.data.uri);
    }
    render() {
        let deleteBtn;
        if (this.props.editMode) {
            deleteBtn = <Button className="btn-small align-right red lighten-2" onClick={this.deleteSongFromPlaylistHandler}>Delete</Button>;
        }
        return(
            <Row>
                <Col s={2} className=''>
                    <img alt={'alt text'} src={this.props.data.image} />
                </Col>
                <Col s={6} className=''>
                    <p>{this.props.data.name}, {this.props.data.album}</p>
                    <p>Artists:
                        {this.props.data.artists.map(key => (
                            <span key={key.name}> {key.name}</span>
                        ))}
                    </p>
                </Col>
                <Col s={4} className=''>
                    {deleteBtn}
                    <Button waves="light" className="btn-small right" onClick={this.playSongHandler}>Play</Button>
                </Col>
            </Row>
        );
    }
}
  
export default PlaylistItem;