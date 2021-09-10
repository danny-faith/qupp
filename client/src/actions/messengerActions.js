import axios from "axios"
import {
	CREATE_MESSAGE_ROOM,
	GET_MESSAGE_ROOM,
	LOADING_MESSAGE_ROOM,
	CLEAR_MESSAGE_ROOM,
	GET_ALL_USERS,
	LOADING_ALL_USERS,
	CLEAR_ALL_USERS,
} from "./types"

export const getAllUsers = () => (dispatch) => {
	dispatch(setAllUsersLoading())

	axios
		.get("/api/message/messenger-users")
		.then((res) =>
			dispatch({
				type: GET_ALL_USERS,
				payload: res.data,
			})
		)
		.catch((err) => console.log(err))
}

export const getMessageRoom = (secondaryUserId) => (dispatch) => {
	dispatch(clearMessageRoom())
	dispatch(messageRoomLoading())

	axios
		.get(`/api/message/${secondaryUserId}`)
		.then((res) =>
			dispatch({
				type: GET_MESSAGE_ROOM,
				payload: res.data,
			})
		)
		.catch((err) => {
			const payload = {
				users: `${err.response.data.primUser},${secondaryUserId}`,
			}
			if (err.response.status === 404) {
				dispatch(createMessageRoom(payload))
			} else {
				window.M.toast({
					html: "There was an error finding / opening the message room. Please try again ",
					classes: "red lighten-2",
				})
			}
		})
}

export const createMessageRoom = (payload) => (dispatch) => {
	axios
		.post("/api/message", payload)
		.then((res) =>
			dispatch({
				type: CREATE_MESSAGE_ROOM,
				payload: res.data,
			})
		)
		.catch((err) => console.log(err))
}

export const clearAllUsers = () => (dispatch) => {
	dispatch({
		type: CLEAR_ALL_USERS,
	})
}

export const clearMessageRoom = () => (dispatch) => {
	dispatch({
		type: CLEAR_MESSAGE_ROOM,
	})
}

export const setAllUsersLoading = () => {
	return {
		type: LOADING_ALL_USERS,
	}
}

export const messageRoomLoading = () => {
	return {
		type: LOADING_MESSAGE_ROOM,
	}
}
