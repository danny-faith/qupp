import React, { Component } from 'react'
import { MyConsumer } from '../../context';

// {this.props.nowPlaying.name}
// export default function NowPlaying() {
//   return (
//       <MyConsumer>
        // {context => <h5>{context.name} - {context.album} - {context.artists.map(artist => <span key={artist}>{artist} </span>)}</h5>}
//       </MyConsumer>
//   )
// }
// {context => <p>{context.name} - {context.album} - {context.artists.map(artist => <span key={artist.id}>{artist.name} </span>)}</p>}

class NowPlaying extends Component {
    
    render() {
        // console.log('this.context: ', this.context);
        return (
            <MyConsumer>
                {context => <p className="m-0">Now playing: <span className="text-pink">{context.nowPlaying.name} - {context.nowPlaying.album} - {context.nowPlaying.artists.map(artist => <span key={artist.id}>{artist.name} </span>)}</span></p>}
            </MyConsumer>
        )
    }
  }

export default NowPlaying;