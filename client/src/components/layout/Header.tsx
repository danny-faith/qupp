import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import NowPlaying from '../common/NowPlaying';
import UpNext from '../common/UpNext';
import ProgressBar from '../playlist/ProgressBar';

interface IProps {
	playlistname: string;
	username: string;
	numberOfSongsInQupplist: number;
	progressValue?: number;
	nowPlayingName?: string;
	nowPlayingAlbum?: string;
	nowPlayingArtists?: string;
	upNextName?: string;
	upNextAlbum?: string;
	upNextArtists?: string;
}

const Header: React.FC<IProps> = ({
	playlistname,
	username,
	numberOfSongsInQupplist,
	progressValue,
	nowPlayingName,
	nowPlayingAlbum,
	nowPlayingArtists,
	upNextName,
	upNextAlbum,
	upNextArtists
}) => {
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
						nowPlayingName={nowPlayingName}
						nowPlayingAlbum={nowPlayingAlbum}
						nowPlayingArtists={nowPlayingArtists}
					/>
					<UpNext
						upNextName={upNextName}
						upNextAlbum={upNextAlbum}
						upNextArtists={upNextArtists}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Header;
