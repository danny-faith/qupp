import React from 'react'
import { MyConsumer } from '../../context';

// {this.props.nowPlaying.name}
export default function NowPlaying() {
  return (
      <MyConsumer>
        {context => <h5>{context.name} - {context.album} - {context.artists.map(artist => <span key={artist}>{artist} </span>)}</h5>}
      </MyConsumer>
  )
}
