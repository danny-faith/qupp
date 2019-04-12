import React from 'react';

function UpNext(props) {    
    return (
        <p className="m-0">Up next: <span className="text-green">{props.upNextName} - {props.upNextAlbum} - {props.upNextArtists.map(artist => <span key={artist.id}>{artist.name} </span>)}</span></p>
    )
}

UpNext.defaultProps = {
    upNextName: '',
    upNextAlbum: '',
    upNextArtists: []
}

export default UpNext;