import { addToQueue } from './player'
import arrayOf11Songs from './arrayOf11Songs'
import song from './song'
import * as R from 'ramda'



// const quppListWithSecondSongRemoved = remove(1, 1, arrayOf11Songs)

describe('Testing addToQueue function', () => {
    const logs = []
    jest.boop = logs

    afterEach(() => {
        // return console.log('logs', jest.boop)
    })

    it('Adds one song to an empty queue', () => {
        const emptyQueue = []
        const populatedQueue = addToQueue(song, emptyQueue)
        expect(populatedQueue).toEqual([song])
    })

    it('Adds one song at index 1 to a queue with more than one song', () => {
        const testArray = [
            arrayOf11Songs[0],
            song,
            ...arrayOf11Songs.slice(1)
        ]
        const newQueue = addToQueue(song, arrayOf11Songs)
        expect(newQueue).toEqual(testArray)
    })

    it('Adds multiple songs to a queue with more than one song', () => {
        const testArray = [
            arrayOf11Songs[0],
            ...arrayOf11Songs,
            ...arrayOf11Songs.slice(1)
        ]
        const newQueue = addToQueue(arrayOf11Songs, arrayOf11Songs)
        expect(newQueue).toEqual(testArray)
    })

    it('Adds multiple songs to an empty queue', () => {
        const testArray = [song]
        const newQueue = addToQueue(song, [])
        expect(newQueue).toEqual(testArray)
    })
})