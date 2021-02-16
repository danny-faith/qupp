import React, { Fragment, Component } from 'react'
import Song from '../../components/playlist/Song'

class SongList extends Component {
    showNoSongsMessage = () => (
        <p>No songs to show</p>
    )

    songComponents = ({ songs, type, addSongToQueueOrQupplistHandler, removeSongFromQueueOrPlaylist }) => (
        songs.map((song, i) => (
            <Song
                addSongToQueueOrQupplistHandler={addSongToQueueOrQupplistHandler}
                removeSongFromQueueOrPlaylist={removeSongFromQueueOrPlaylist}
                type={type}
                data={song} 
                index={i}
                key={`${i}${song.spotId}`}
            />)
        )
    )

    songListContent = () => {
        const { songs, addSongToQueueOrQupplistHandler, type, removeSongFromQueueOrPlaylist } = this.props
        const params = {
            songs,
            addSongToQueueOrQupplistHandler,
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