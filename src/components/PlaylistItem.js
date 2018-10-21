import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import PropTypes from 'prop-types';

class PlaylistItem extends Component {
  
    deleteSongFromPlaylistHandler = () => {
        console.log('delete a song');
        this.props.deleteSongFromPlaylist(this.props.data);
    }
    render() {
        return(
            <Row>
                <Col s={2} className=''>
                    <img src={this.props.data.image.url} />
                </Col>
                <Col s={5} className=''>
                    <p>{this.props.data.name}, {this.props.data.album}</p>
                    <p>Artists:
                        {this.props.data.artists.map(key => (
                        <span key={key.name}> {key.name}</span>
                        ))}
                    </p>
                </Col>
                <Col s={5} className=''>
                    <Button className="btn-small align-right" onClick={this.deleteSongFromPlaylistHandler}>Delete</Button>
                </Col>
            </Row>
        );
    }
}
  
  export default PlaylistItem;