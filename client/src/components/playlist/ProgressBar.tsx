import React, { useState } from "react"
import useInterval from "../../utils/useInterval"

interface IProps {
	duration_secs: number
	onComplete: Function
	playing: boolean
}

const ProgressBar: React.FC<IProps> = ({
	duration_secs,
	onComplete,
	playing,
}) => {
	const [progress, setProgress] = useState(0)
	let secondsPassed =
		playing && duration_secs
			? Math.round((duration_secs / 100) * progress)
			: 0

	useInterval(
		() => {
			const percent = Math.round((secondsPassed / duration_secs) * 100)

			setProgress(percent)
			if (percent >= 100) {
				setProgress(0)
				onComplete()
			}
			secondsPassed++
		},
		playing ? 30 : null
	)

	return (
		<div className="progress-bar">
			<span style={{ width: `${progress}%` }} />
		</div>
	)
}

export default ProgressBar
