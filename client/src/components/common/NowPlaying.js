import React, { Component } from 'react'
import { MyConsumer } from '../../context';
import PropTypes from 'prop-types';

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
    componentWillUpdate = (stuff) => {
        // console.log(stuff);
        
    }
    render() {
        
        return (
            <p>{this.props.nowPlaying.name}</p>
        )
    }
}

// NowPlaying.propTypes = {
//     message: PropTypes.string,
//     onClick: PropTypes.func
//   };

export default NowPlaying;