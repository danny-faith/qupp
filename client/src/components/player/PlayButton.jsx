import React from "react"
import { Button } from "react-materialize"

const PlayButton = ({ onClick, disabled, playing }) => (
	<Button
		onClick={onClick}
		disabled={disabled}
		className={`m-2 ${playing ? "red" : ""}`}
	>
		{playing ? "Stop ■" : "Play ►"}
	</Button>
)

const areEqual = (prevProps, nextProps) => {
	if (
		prevProps.playing === nextProps.playing &&
		prevProps.disabled === nextProps.disabled
	) {
		return true
	}
	return false
}

export default React.memo(PlayButton, areEqual)
