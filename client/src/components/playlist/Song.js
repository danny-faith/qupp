import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';

export default class Song extends Component {
  componentDidMount = () => {
      const elems = document.querySelectorAll('.fixed-action-btn');
      const instances = window.M.FloatingActionButton.init(elems, {
        direction: 'left'
      });      
  }
  handleAddSong = (e) => {    
    const { data } = this.props;
    const songToAdd = {
        name: data.name,
        album: data.album,
        image: data.image,
        artists: data.artists,
        spotId: data.spotId,
        uri: data.uri
    }
    this.props.addSongToQueueOrPlaylist(songToAdd, e.currentTarget.dataset.type);
  }
  handleRemoveSong = (e) => {
    // const copyOfPlaylist = {...this.state};
    // console.log(copyOfPlaylist);
    this.props.removeSongFromQueueOrPlaylist(this.props.data.spotId, e.currentTarget.dataset.type);
    
    // const index = copyOfPlaylist.songs.find(x => x.spotId === this.props.data.spotId);
    // console.log('index: ', index);
    
    // copyOfPlaylist.songs[this.props.data.spotId] = null;

    // this.setState({
    //   playlist: copyOfPlaylist
    // });
  }
  render () {
    let songButtons = '';
    if (this.props.type === 'search') {
      songButtons = (
        <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
          <Button onClick={this.handleAddSong} data-type="songs" floating icon='playlist_add' className='blue'/>
          <Button onClick={this.handleAddSong} data-type="queue" floating icon='playlist_add' className='yellow darken-1' />
        </Button>
      );
    } else if (this.props.type === 'qupplist') {
      songButtons = (
        <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
          <Button onClick={this.handleRemoveSong} data-type="songs" floating icon='delete' className='red darken-1'/>
          <Button onClick={this.handleAddSong} data-type="queue" floating icon='playlist_add' className='yellow darken-1'/>
        </Button>
      );
    } else if (this.props.type === 'queue') {
      songButtons = (
        <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
          <Button onClick={this.handleRemoveSong} data-type="queue" floating icon='delete' className='red darken-1'/>
          <Button onClick={this.handleAddSong} data-type="songs" floating icon='playlist_add' className='blue darken-1'/>
        </Button>
      );
    }
    const classes = `${this.props.colour} py-3 darken-2 mb-0`;
    const { data } = this.props;
    return (
      <Row className={classes}>
          <Col s={2} className="">
            <img src={data.image} className="w-full block" />
          </Col>
          <Col s={8} className="pl-0">
            <p className="my-0">{data.name}, {data.album}, Artists: 
              {data.artists.map(key => (
                <span key={key.name}> {key.name}</span>
              ))}
            </p>
          </Col>
          <Col s={2} className="pl-0 relative">
          {songButtons}
          </Col>
      </Row>
    )
  }
}
