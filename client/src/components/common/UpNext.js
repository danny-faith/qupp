import React from 'react'

function UpNext(props) {
    const {
        name,
        album,
        artists = [],
    } = props.upNext

    return (
        <p className="m-0">
            <span>Up next: </span>
            <span className="text-green">
                {name} - {album} - {artists.map(artist => <span key={artist.id}>{artist.name} </span>)}
            </span>
        </p>
    )
}

UpNext.defaultProps = {
    upNext: {
        name: '',
        album: '',
        artists: []
    },
}

export default UpNext
