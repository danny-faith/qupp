import React, { useState, useEffect, Fragment } from "react"
import Dropzone from "react-dropzone"
import classNames from "classnames"
import { Button } from "react-materialize"
import { uploadAvatarImage } from "../../actions/authActions"
import { connect } from "react-redux"
import PropTypes from "prop-types"

export function UploadAvatar(props) {
	const [preview, setPreview] = useState("")
	const [formData, setFormData] = useState("")

	const maxFileSize = 1024 * 1024 * 4 // 4MB
	let avatarPreview = ""

	const onDrop = (acceptedFiles, rejectedFiles) => {
		const errors = {}
		const acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"]
		const formData = new FormData()
		formData.append("avatar", acceptedFiles[0])

		if (rejectedFiles.length > 0) {
			if (rejectedFiles.length > 1) {
				errors.multiple = "Please upload one file"
			}
			if (rejectedFiles[0].size > maxFileSize) {
				errors.fileSize = "File size too large"
			}
			if (!acceptedFileTypes.includes(rejectedFiles[0].type)) {
				errors.mimeType = "File rejected - .jpg, .png, .gif only"
			}
			return Object.keys(errors).map((key) =>
				window.M.toast({ html: errors[key], classes: "red lighten-1" })
			)
		}

		avatarPreview = URL.createObjectURL(acceptedFiles[0])

		setPreview(avatarPreview)
		setFormData(formData)
	}

	const submitAvatar = () => {
		props.uploadAvatarImage(formData)
	}

	useEffect(() => {
		return () => {
			URL.revokeObjectURL(avatarPreview)
		}
	}, [avatarPreview])

	return (
		<Fragment>
			<p>Max file size: 3MB</p>
			<p>Recommened file dimensions: 300px x 300px</p>
			<p>File types: JPG, PNG and GIFs</p>
			<p>NOTE: Uploading an avatar will override Gravatar</p>
			{preview && (
				<div
					style={{ backgroundImage: `url(${preview}` }}
					className="avatar-preview-image overflow-hidden my-6 mx-auto block rounded-full"
				></div>
			)}
			<Dropzone
				accept=".jpg,.png,.gif"
				onDrop={onDrop}
				maxSize={maxFileSize}
				multiple={false}
			>
				{({ getRootProps, getInputProps, isDragActive }) => {
					return (
						<div
							{...getRootProps()}
							className={classNames("dropzone", {
								"dropzone--isActive": isDragActive,
							})}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop files here...</p>
							) : (
								<p>
									Try dropping some files here, or click to
									select files to upload.
								</p>
							)}
						</div>
					)
				}}
			</Dropzone>
			<Button
				onClick={submitAvatar}
				className="btn-small right mt-4"
				waves="light"
			>
				Submit
			</Button>
		</Fragment>
	)
}

UploadAvatar.propTypes = {
	uploadAvatarImage: PropTypes.func.isRequired,
}

export default connect(null, { uploadAvatarImage })(UploadAvatar)
