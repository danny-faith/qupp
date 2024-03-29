import axios from "axios"
import setAxiosHeaderAuthToken from "./setAxiosHeaderAuthToken"

const token =
	"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGUwOWNiMzQ1YzY2MzNkNzdhOWIwNiIsInVzZXJuYW1lIjoiRGFubnlXb2JibGUzIiwiYXZhdGFyIjoidXBsb2Fkcy9hdmF0YXJzLzIwMjAtMTItMjBUMTg6NDI6MDUuMDg0Wi1wbmctdHJhbnNwYXJlbnQtY29sb25lbC1zYW5kZXJzLWtmYy1mcmllZC1jaGlja2VuLWZhc3QtZm9vZC1yZXN0YXVyYW50LWJlYXV0eS1wYXJsb3Itcy1mb29kLWZhc3QtZm9vZC1yZXN0YXVyYW50LWxvZ28ucG5nIiwiaWF0IjoxNjExNjc2NjA2LCJleHAiOjE2MTE2ODAyMDZ9.Ck1MFnaNY425LKUB8inUKe3sLNpxB3nKgfOKi9kfvj0"

describe("Testing setAxiosHeaderAuthToken", () => {
	beforeEach(() => {
		return delete axios.defaults.headers.common["Authorization"]
	})

	it("Token supplied", () => {
		setAxiosHeaderAuthToken(token)
		expect(axios.defaults.headers.common["Authorization"]).toBe(token)
	})

	it("No token supplied", () => {
		setAxiosHeaderAuthToken()
		expect(axios.defaults.headers.common["Authorization"]).toBe(undefined)
	})

	it("Invalid token type supplied: number, object, array and NaN", () => {
		setAxiosHeaderAuthToken(12)
		expect(axios.defaults.headers.common["Authorization"]).toBe(undefined)
		setAxiosHeaderAuthToken({})
		expect(axios.defaults.headers.common["Authorization"]).toBe(undefined)
		setAxiosHeaderAuthToken([])
		expect(axios.defaults.headers.common["Authorization"]).toBe(undefined)
		setAxiosHeaderAuthToken(NaN)
		expect(axios.defaults.headers.common["Authorization"]).toBe(undefined)
	})
})
