import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import NowPlaying from '../common/NowPlaying';
import UpNext from '../common/UpNext';
import isEmpty from '../../utils/isEmpty';

class Header extends Component {
  render() {
    let upNext;
    // debugger;
    if (!isEmpty(this.props.queue) && this.props.playing) {
      // console.log('theres a queue to speak of');
      if (this.props.queue.length > 1) {
        // console.log('render the damn upnext');
        upNext = <UpNext />;
      }
    }
    return (
      <div className="header text-center py-8">
        <h1 className="text-5xl my-0">{this.props.playlistname}</h1>
        <p className="text-1xl mt-2 mb-0">{this.props.username}</p>
        <p className="text-1xl mt-0">{this.props.songs} songs in qupplist</p>
        <Row>
          <Col s={6} offset="s3">
            <p className="m-0">Play ►</p>
            <NowPlaying nowPlaying={this.props.nowPlaying}/>
            <UpNext upNext={this.props.upNext} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header;