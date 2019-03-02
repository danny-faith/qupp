import React from 'react';
import { Row, Col } from 'react-materialize';
import SpotifyPlayer from 'react-spotify-player';

export default function Header(props) {
    // set `SpotifyPlayer` styling
  const size = {
    width: '100%',
    height: 77,
  };
  const view = 'list'; // or 'coverart'
  const theme = 'black'; // or 'white'
  return (
    <div className="header text-center py-8">
      <h1 className="text-5xl my-0">Daniel's party</h1>
      <p className="text-1xl mt-2 mb-0">{props.username}</p>
      <p className="text-1xl mt-0">{props.songs} songs in qupplist</p>
      <Row>
        <Col s={4} offset="s4">
          <SpotifyPlayer 
            uri="spotify:track:3YXlTtlYDXI2SyofNm1ccg"
            size={size}
            view={view}
            theme={theme} />
        </Col>
      </Row>
    </div>
  )
}
