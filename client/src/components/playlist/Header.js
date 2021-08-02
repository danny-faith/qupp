import React from 'react'
import { Row, Col } from 'react-materialize'
import NowPlaying from '../common/NowPlaying'
import UpNext from '../common/UpNext'
import ProgressBar from '../playlist/ProgressBar'

function Header(props) {
    const {
        playlistname,
        username,
        numberOfSongsInQupplist,
        progressValue,
        nowPlaying,
        upNext,
    } = props

    return (
        <div className="header text-center py-8">
            <h1 className="text-5xl my-0">{playlistname}</h1>
            <p className="text-1xl mt-2 mb-0">{username}</p>
            <p className="text-1xl mt-0">
                {numberOfSongsInQupplist}{' '}
                {numberOfSongsInQupplist === 1 ? 'song' : 'songs'} in qupplist
            </p>
            <Row>
                <Col s={6} offset="s3">
                    <ProgressBar progress={progressValue} />
                    <NowPlaying
                        nowPlaying={nowPlaying}
                    />
                    <UpNext
                        upNext={upNext}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default Header
