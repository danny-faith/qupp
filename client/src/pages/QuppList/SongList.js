import React, { Fragment, Component } from 'react'
import Song from '../../components/playlist/Song'

class SongList extends Component {
    showNoSongsMessage = () => (
        <p>No songs to show</p>
    )

    songComponents = ({ songs, type, addSongToQueueOrPlaylist, removeSongFromQueueOrPlaylist }) => (
        songs.map((song, i) => (
            <Song
                addSongToQueueOrPlaylist={addSongToQueueOrPlaylist}
                removeSongFromQueueOrPlaylist={removeSongFromQueueOrPlaylist}
                type={type}
                data={song} 
                index={i}
                key={`${i}${song.spotId}`}
            />)
        )
    )

    songListContent = () => {
        const { songs, addSongToQueueOrPlaylist, type, removeSongFromQueueOrPlaylist } = this.props
        const params = {
            songs,
            addSongToQueueOrPlaylist,
            removeSongFromQueueOrPlaylist,
            type,
        }

        if (songs.length > 0) {
            return this.songComponents(params)
        }
        return this.showNoSongsMessage()
    }

    render() {
        return (
            <Fragment>
                {this.songListContent()}
            </Fragment>
        )
    }
}

export default SongList
