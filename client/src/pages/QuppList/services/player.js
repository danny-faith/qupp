import { lensPath, view, equals, always, ifElse, has, hasPath, tap, length, gt, is, propSatisfies } from 'ramda'

function populateNowPlaying(play) {
    let nowPlaying = {...this.state.nowPlaying};
    nowPlaying = this.state.playlist.queue[0];
    const playBool = (play) ? this.playSong : null;
    this.setState({nowPlaying}, playBool);
}

function getNowPlayingSong(state) {
    const songUpNextPath = lensPath([
        'playlist',
        'queue',
        0
    ])
    const songUpNext = ifElse(
        hasPath(['playlist', 'queue']),
        view(songUpNextPath),
        always({}),
    )
    return songUpNext(state)
}

function getUpNextSong(state) {
    const songUpNextPath = lensPath([
        'playlist',
        'queue',
        1
    ])
    const songUpNext = ifElse(
        hasPath(['playlist', 'queue']),
        view(songUpNextPath),
        always({}),
    )
    return songUpNext(state)
}

export {
    // playNextSong,
    populateNowPlaying,
    // populateNowPlaying2,
    getNowPlayingSong,
    getUpNextSong,
}
