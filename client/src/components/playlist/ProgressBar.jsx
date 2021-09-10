import * as React from "react"

function ProgressBar(props) {
	return (
		<div className="progress-bar">
			<span style={{ width: `${props.progress}%` }} />
		</div>
	)
}

export default ProgressBar
