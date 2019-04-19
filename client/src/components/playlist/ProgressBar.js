import React from 'react'

export default function ProgressBar(props) {
  return (
    <div className="progress-bar">
        <span style={{ width: `${props.progress}%`}}></span>
    </div>
  )
}

