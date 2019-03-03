import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';

export default class Song extends Component {
  handleAddSongToPlaylist = () => {
    
    const { data } = this.props;
    const songToAdd = {
        name: data.name,
        album: data.album,
        image: data.image,
        artists: data.artists,
        spotId: data.spotId,
        uri: data.uri
    }
    this.props.addSongToPlaylist(songToAdd);
  }
  handleAddSongToQueue = () => {
    const { data } = this.props;
    const songToAdd = {
        name: data.name,
        album: data.album,
        image: data.image,
        artists: data.artists,
        spotId: data.spotId,
        uri: data.uri
    }
    this.props.addSongToQueue(songToAdd);
  }
  render () {
    const classes = `${this.props.colour} py-3 darken-2 mb-0`;
    const { data } = this.props;
    return (
      <Row onClick={this.handleAddSongToPlaylist} className={classes}>
          <Col s={2} className="">
            <img src={data.image} className="w-full block" />
          </Col>
          <Col s={3} className="pl-0">
            <p className="my-0">{data.name}</p>
          </Col>
          <Col s={3} className="pl-0">
            <p className="my-0">{data.album}</p>
          </Col>
          <Col s={3} className="pl-0">
            <p className="my-0">
              Artists: 
              {data.artists.map(key => (
                <span key={key.name}> {key.name}</span>
              ))}
            </p>
          </Col>
      </Row>
    )
  }
}
