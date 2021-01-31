import { lensPath, view, equals, remove, propEq, findIndex, slice, always, ifElse, has, hasPath, tap, length, gt, is, propSatisfies, set, over } from 'ramda'
import isEmpty from '../../../utils/isEmpty'

function removeFirstSongFromQueue(queue) {
    const newQueue = slice(1, Infinity)
    return newQueue(queue)
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
    removeFirstSongFromQueue,
    getNowPlayingSong,
    getUpNextSong,
}
