import React, { Component } from 'react'
import { MyConsumer } from '../../context';

// {this.props.upNext.name}
// export default function UpNext() {
//   return (
//       <MyConsumer>
        // {context => <h5>{context.name} - {context.album} - {context.artists.map(artist => <span key={artist}>{artist} </span>)}</h5>}
//       </MyConsumer>
//   )
// }

class UpNext extends Component {
    
    render() {
        // console.log('this.context: ', this.context);
        return (
            <MyConsumer>
                {context => <p className="m-0">Up next: <span className="text-green">{context.upNext.name} - {context.upNext.album} - {context.upNext.artists.map(artist => <span key={artist.id}>{artist.name} </span>)}</span></p>}
            </MyConsumer>
        )
    }
  }

export default UpNext;