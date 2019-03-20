import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
// import PropTypes from 'prop-types';

class PlaylistItem extends Component {
    
    /**
     * Delete song form playlist using the function passed down via props from `App.js` and the Spotify Id
     * Later this wil be done using the mongo _id
     */
    deleteSongFromPlaylistHandler = () => {
        this.props.deleteSongFromPlaylist(this.props.data.spotId);
    }
    /**
     * Pass the Spotify URI as argument to the playSong function passed down via props from App.js
     */
    playSongHandler = () => {
        this.props.playSong(this.props.data.uri);
    }
    handleaddSongToQueue = () => {
        const data = this.props.data;
        const songToQueue = {
            name: data.name,
            album: data.album,
            artists: data.artists,
            spotId: data.spotId,
            uri: data.uri
        }
        this.props.addSongToQueue(songToQueue);
    }
    render() {
        /**
         * Depending on editmode state(bool). Show play/preview button or delete button
         * editMode == true : Show delete button
         * editMode == false : Show play/preview song button
         */
        let button;
        if (this.props.editMode) {
            button = <Button className="btn-small right red lighten-2" waves="light" onClick={this.deleteSongFromPlaylistHandler}>Delete</Button>;
        } else {
            // button = <Button className="btn-small right" waves="light" onClick={this.playSongHandler}>Play</Button>;
        }
        return(
            <Row>
                <Col s={2}>
                    <img alt={'alt text'} src={this.props.data.image} />
                </Col>
                <Col className="track-info" s={6}>
                    <p>{this.props.data.name}, {this.props.data.album}</p>
                    <p>Artists:
                        {this.props.data.artists.map(key => (
                            <span key={key.name}> {key.name}</span>
                        ))}
                    </p>
                </Col>
                <Col s={4}>
                    <Button className="btn-small green lighten-2 right" waves="light" icon="playlist_add" onClick={this.handleaddSongToQueue}></Button>
                    {button}
                </Col>
            </Row>
        );
    }
}
  
export default PlaylistItem;