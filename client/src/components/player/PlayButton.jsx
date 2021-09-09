import React from "react"
import { Button } from "react-materialize"

const areEqual = (prevProps, nextProps) => {
	if (
		prevProps.playing === nextProps.playing &&
		prevProps.disabled === nextProps.disabled
	) {
		return true
	}
	return false
}

const PlayButton = React.memo(
	({ onClick, disabled, playing }) => (
		<Button
			onClick={onClick}
			disabled={disabled}
			className={`m-2 ${playing ? "red" : ""}`}
		>
			{playing ? "Stop ■" : "Play ►"}
		</Button>
	),
	areEqual
)

export default PlayButton
