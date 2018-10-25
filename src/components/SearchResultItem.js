import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
// import PropTypes from 'prop-types';

class SearchResultItem extends Component {
  
  addSongToPlaylistHandler = (song) => {
    console.log('send a song');
    this.props.addSongToPlaylist(this.props.data);
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
          <Button className="btn-small right" onClick={this.addSongToPlaylistHandler}>Add</Button>
        </Col>
      </Row>
    );
  }
}
  
  export default SearchResultItem;