import { removeFirstSongFromQueue } from "./player"
import arrayOf11Songs from "./arrayOf11Songs"

describe("Testing removeFirstSongFromQueue function", () => {
	it("Returns queue minus one song", () => {
		const amendedQueue = removeFirstSongFromQueue(arrayOf11Songs)
		expect(amendedQueue).toEqual(arrayOf11Songs.slice(1))
	})

	it("Returns empty object if not enough songs in provided queue", () => {
		const amendedQueue = removeFirstSongFromQueue([])
		expect(amendedQueue).toEqual([])
	})
})
