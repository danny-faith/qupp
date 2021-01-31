import { removeSongByIndex } from './player'
import dummyQueue from './dummyQueue'
import { remove } from 'ramda'

const state = {
    playlist:{ 
        queue: [...dummyQueue],
        qupplist: [...dummyQueue],
    }
}

const quppListWithSecondSongRemoved = remove(1, 1, dummyQueue)

describe('Testing removeSongByIndex function', () => {
    const logs = []
    jest.boop = logs

    afterEach(() => {
        return console.log('logs', jest.boop)
    })

    it('Removes song from qupplist by index', () => {
        const amendedArray = removeSongByIndex(1, state.playlist.qupplist)
        // jest.boop = amendedArray
        expect(amendedArray).toEqual(quppListWithSecondSongRemoved)
    })

    // it('Returns empty object if not enough songs in provided state', () => {
    //     const state = {
    //         playlist: {}
    //     }
    //     const nextSong = removeSongByIndex(state)
    //     expect(nextSong).toEqual({})
    // })
})