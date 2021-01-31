import { removeFirstSongFromQueue } from './player'
import dummyQueue from './dummyQueue'

describe('Testing removeFirstSongFromQueue function', () => {

    it('Returns queue minus one song', () => {
        const amendedQueue = removeFirstSongFromQueue(dummyQueue)
        expect(amendedQueue).toEqual(dummyQueue.slice(1))
    })

    it('Returns empty object if not enough songs in provided queue', () => {
        const amendedQueue = removeFirstSongFromQueue([])
        expect(amendedQueue).toEqual([])
    })
})