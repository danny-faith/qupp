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
            <p>{this.props.upNext.name}</p>
        )
    }
  }

export default UpNext;