import axios from "axios"
import setAxiosHeaderAuthToken from "../utils/setAxiosHeaderAuthToken"
import jwt_decode from "jwt-decode"
import { GET_ERRORS, SET_CURRENT_USER, PASSWORD_UPDATE_SUCCESS } from "./types"
import firebase from "firebase/app"

export const registerUser = (userData, history) => (dispatch) => {
	axios
		.post("/api/users/register", userData)
		.then(() => {
			window.M.toast({
				html: "Account successfully created",
				classes: "green lighten-2",
			})
			history.push("/login")
		})
		.catch((err) => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		})
}

export const loginUser = (userData) => (dispatch) => {
	axios
		.post("/api/users/login", userData)
		.then((res) => {
			const { token, firebaseToken } = res.data

			localStorage.setItem("jwtToken", token)
			localStorage.setItem("firebaseToken", firebaseToken)

			setAxiosHeaderAuthToken(token)

			const decoded = jwt_decode(token)

			firebase
				.auth()
				.signInWithEmailAndPassword(
					userData.usernameOrEmail,
					userData.password
				)
				.then((userCredential) => {
					// const user = userCredential.user
				})
				.catch((error) => {
					const { code } = error
					const { message } = error
					console.log(
						"firebase user NOT signed in",
						{ code },
						{ message }
					)
				})

			dispatch(setCurrentUser(decoded))
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		)
}

export const setCurrentUser = (decoded) => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded,
	}
}

export const uploadAvatarImage = (formData) => (dispatch) => {
	axios
		.post("/api/users/avatar", formData)
		.then((res) => {
			window.M.toast({
				html: `Avatar successfully uploaded`,
				classes: "green lighten-2",
			})

			dispatch(resetJWT(res.data))
		})
		.catch((err) => console.log(err))
}

export const resetJWT = (payload) => (dispatch) => {
	axios
		.post("/api/users/update-token", payload)
		.then((res) => {
			localStorage.setItem("jwtToken", res.data.token)

			setAxiosHeaderAuthToken(res.data.token)

			const decoded = jwt_decode(res.data.token)

			dispatch(setCurrentUser(decoded))
		})
		.catch((err) => console.log(err))
}

export const logoutUser = () => (dispatch) => {
	localStorage.removeItem("jwtToken")

	setAxiosHeaderAuthToken(false)

	dispatch(setCurrentUser({}))
}

export const forgotPasswordEmailSearch = (email) => (dispatch) => {
	axios
		.post("/api/users/forgot-password", email)
		.then((res) => {
			window.M.toast({
				html: `Password reset email sent to:&nbsp;<strong>${res.data.email}</strong>`,
				classes: "green lighten-2",
			})
		})
		.catch((err) => {
			if (err.response.data.hasOwnProperty("mailFailed")) {
				window.M.toast({
					html: "There was an error sending the email. Please try again.",
					classes: "red lighten-1",
				})
			}

			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
		})
}

export const changePassword = (payload) => (dispatch) => {
	// TODO User needs to be either logged out or re logged in automatically if they were already logged in
	axios
		.post(`/api/users/forgot-password-reset`, payload)
		.then((res) => {
			dispatch({
				type: PASSWORD_UPDATE_SUCCESS,
				payload: {
					status: "success",
				},
			})
			window.M.toast({
				html: `Password succesfully reset`,
				classes: "green lighten-2",
			})
		})
		.catch((err) => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data,
			})
			console.log(err)
		})
}

export const updateUserLastOnlineOrEmail = (payload) => () => {
	axios
		.put(`/api/users/${payload.userId}`, payload)
		.then(() => {
			// TODO maybe dispatch in here to send news online/offline status to redux to re-render user colour in messenger
		})
		.catch((err) => console.log(err))
}
