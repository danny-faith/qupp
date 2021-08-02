import { getUpNextSong } from './player'
import arrayOf11Songs from './arrayOf11Songs'

const state = {
    playlist:{ 
        queue: [...arrayOf11Songs],
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