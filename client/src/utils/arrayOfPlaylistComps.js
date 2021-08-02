import React from 'react'
import PlaylistListItem from '../components/playlist/PlaylistListItem'

const arrayOfPlaylistComps = (playlists) => (
    playlists
        .map((playlist) => (
            <PlaylistListItem 
                key={playlist._id}
                id={playlist._id}
                name={playlist.name} 
                slug={playlist.slug} 
                shareLink={playlist.share_link}
            />
        )
    )
)

export default arrayOfPlaylistComps
