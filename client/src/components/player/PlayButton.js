import React from 'react'
import { Button } from 'react-materialize'

function PlayButton({onClick, disabled, playing}) {
    console.log('playButton render');
    return (
        <Button onClick={onClick} disabled={disabled} className={`m-2 ${(playing) ? 'red' : ''}`}>
            {(playing)
                ? 'Stopppp ■'
                : 'Playyyy ►'
            }
        </Button>
    )
}

export default React.memo(PlayButton)