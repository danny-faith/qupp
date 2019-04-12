import React from 'react';

function NowPlaying(props) {    
    return (
        <p className="m-0">Now playing: <span className="text-pink">{props.nowPlayingName} - {props.nowPlayingAlbum} - {props.nowPlayingArtists.map(artist => <span key={artist.id}>{artist.name} </span>)}</span></p>
    )
}

NowPlaying.defaultProps = {
    nowPlayingName: '',
    nowPlayingAlbum: '',
    nowPlayingArtists: []
}

export default NowPlaying;