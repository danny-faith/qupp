import * as React from "react"

interface IProps {
	progress?: number
}

const ProgressBar: React.FC<IProps> = ({ progress }) => {
	return (
		<div className="progress-bar">
			<span style={{ width: `${progress}%` }} />
		</div>
	)
}

export default ProgressBar
