import axios from "axios"

export const uploadAvatarImage = (formData) => (dispatch) => {
	axios
		.post("/api/users/avatar", formData)
		.then((res) => {
			console.log("res: ", res)
		})
		.catch((err) => console.log(err))
}
