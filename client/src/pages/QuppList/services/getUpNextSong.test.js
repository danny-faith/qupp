import { getUpNextSong } from './player'
import dummyQueue from './dummyQueue'

const state = {
    playlist:{ 
        queue: [...dummyQueue],
    }
}

describe('Testing getUpNextSong function', () => {

    it('Gets song at second index', () => {
        const nextSong = getUpNextSong(state)
        expect(nextSong).toEqual(state.playlist.queue[1])
    })

    it('Returns empty object if not enough songs in provided state', () => {
        const state = {
            playlist: {}
        }
        const nextSong = getUpNextSong(state)
        expect(nextSong).toEqual({})
    })
})