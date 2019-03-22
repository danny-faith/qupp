import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import NowPlaying from './NowPlaying';

class Header extends Component {
  render() {
    return (
      <div className="header text-center py-8">
        <h1 className="text-5xl my-0">{this.props.playlistname}</h1>
        <p className="text-1xl mt-2 mb-0">{this.props.username}</p>
        <p className="text-1xl mt-0">{this.props.songs} songs in qupplist</p>
        <Row>
          <Col s={6} offset="s3">
            <NowPlaying />
            <h6 className="mb-0">Up next: {this.props.upNext}</h6>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header;