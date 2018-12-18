import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import axios from 'axios';
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
        // this.props.playSong(this.props.data.uri);
        axios.put(`https://api.spotify.com/v1/me/player/play?device_id=8fa77237fe6f04ee6b296f13789e4f081bb6339f`, {
            headers: {
                'Authorization': 'Bearer BQDJjeZUI--CAIILtC4w8N9x-t0DgntTYFcRulDtKodEz_ZVxyDLsKi4ThPd68RILesc7DTv95Y21hwBryXguWu-sazReJ5rqd7lMctqPtA87wOkYZnffuXcseQ7c9KggUzieupV36RUJ2Ws8u2HfpkC'
            },
            body: {
                "context_uri": "spotify:album:7nXJ5k4XgRj5OLg9m8V3zc",
                "offset": {
                  "position": 6
                },
                "position_ms": 0
            }
        })
        .then(res => {
        })
        .catch(err => {
            console.dir(err);
            
        });
    }
    handleAddSongToPlayQueue = () => {
        const data = this.props.data;
        const songToQueue = {
            name: data.name,
            album: data.album,
            artists: data.artists,
            spotId: data.spotId,
            uri: data.uri
        }
        this.props.addSongToPlayQueue(songToQueue);
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
            button = <Button className="btn-small right" waves="light" onClick={this.playSongHandler}>Play</Button>;
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
                    <Button className="btn-small green lighten-2 right" waves="light" icon="playlist_add" onClick={this.handleAddSongToPlayQueue}></Button>
                    {button}
                </Col>
            </Row>
        );
    }
}
  
export default PlaylistItem;