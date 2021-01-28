import { getNowPlayingSong } from './player'
import dummyQueue from './dummyQueue'

const state = {
    playlist:{ 
        queue: [...dummyQueue],
    }
}

describe('Testing getNowPlayingSong function', () => {
    beforeEach(() => {
        return ''
    })

    it('Gets song at second index', () => {
        const nextSong = getNowPlayingSong(state)
        expect(nextSong).toEqual(state.playlist.queue[0])
    })

    it('Returns empty object if not enough songs in provided state', () => {
        const state = {
            playlist: {}
        }
        const nextSong = getNowPlayingSong(state)
        expect(nextSong).toEqual({})
    })
})