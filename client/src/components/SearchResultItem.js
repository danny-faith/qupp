import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
// import PropTypes from 'prop-types';

class SearchResultItem extends Component {
  
  addSongToPlaylistHandler = () => {
    /*
     * Pass the song object up to app.js via `this.props.addSongToPlaylist()`
     * using the song object inside `props.data` to send back
     */
    this.props.addSongToPlaylist(this.props.data);
  }
  handleAddSongToPlayQueue = () => {
    const data = this.props.data;
    const songToQueue = {
        name: data.name,
        album: data.album,
        artists: data.artists,
        uri: data.uri
    }
    this.props.addSongToPlayQueue(songToQueue);
}
  render() {
    return(
      <Row>
        <Col s={2} className=''>
          <img alt={'alt text'} src={this.props.data.image} />
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
          <Button waves="light" className="btn-small right" onClick={this.addSongToPlaylistHandler}>Add</Button>
          <Button className="btn-small green lighten-2 right" waves="light" icon="playlist_add" onClick={this.handleAddSongToPlayQueue}></Button>
        </Col>
      </Row>
    );
  }
}
  
  export default SearchResultItem;