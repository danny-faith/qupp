import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import NowPlaying from '../common/NowPlaying';
import UpNext from '../common/UpNext';
import ProgressBar from '../playlist/ProgressBar';

class Header extends Component {
  render() {
    return (
      <div className="header text-center py-8">
        <h1 className="text-5xl my-0">{this.props.playlistname}</h1>
        <p className="text-1xl mt-2 mb-0">{this.props.username}</p>
        <p className="text-1xl mt-0">{this.props.qupplist} {(this.props.qupplist === 1) ? 'song' : 'songs'} in qupplist</p>
        <Row>
          <Col s={6} offset="s3">
            <ProgressBar />
            <ProgressBar />
            <NowPlaying nowPlayingName={this.props.nowPlayingName} nowPlayingAlbum={this.props.nowPlayingAlbum} nowPlayingArtists={this.props.nowPlayingArtists}/>
            <UpNext upNextName={this.props.upNextName} upNextAlbum={this.props.upNextAlbum} upNextArtists={this.props.upNextArtists}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header;