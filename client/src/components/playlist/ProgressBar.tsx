import React, { useState } from "react"
import useInterval from "../../utils/useInterval"

interface IProps {
	progress?: number
	duration_secs?: number
	playNextSong: Function
	playing: boolean
}

const ProgressBar: React.FC<IProps> = ({
	duration_secs,
	playNextSong,
	playing,
}) => {
	const [progress, setProgress] = useState(0)
	let secondsPassed =
		playing && duration_secs
			? Math.round((duration_secs / 100) * progress)
			: 0

	useInterval(
		() => {
			if (playing && duration_secs) {
				const percent = Math.round(
					(secondsPassed / duration_secs) * 100
				)

				setProgress(percent)
				if (percent >= 100) {
					setProgress(0)
					playNextSong()
				}
				secondsPassed++
			}
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
