import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import NowPlaying from '../common/NowPlaying';
import UpNext from '../common/UpNext';
import ProgressBar from '../playlist/ProgressBar';

class Header extends Component {
  render() {
    // let upNext;
    // debugger;
    // if (!isEmpty(this.props.queue) && this.props.playing) {
    //   // console.log('theres a queue to speak of');
    //   if (this.props.queue.length > 1) {
    //     // console.log('render the damn upnext');
    //     upNext = <UpNext />;
    //   }
    // }
    return (
      <div className="header text-center py-8">
        <h1 className="text-5xl my-0">{this.props.playlistname}</h1>
        <p className="text-1xl mt-2 mb-0">{this.props.username}</p>
        <p className="text-1xl mt-0">{this.props.songs} songs in qupplist</p>
        <Row>
          <Col s={6} offset="s3">
            <ProgressBar progress={this.props.progress} />
            <NowPlaying nowPlayingName={this.props.nowPlayingName} nowPlayingAlbum={this.props.nowPlayingAlbum} nowPlayingArtists={this.props.nowPlayingArtists}/>
            <UpNext upNextName={this.props.upNextName} upNextAlbum={this.props.upNextAlbum} upNextArtists={this.props.upNextArtists}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header;