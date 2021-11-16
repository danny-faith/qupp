import React, { ReactElement } from "react"
import PlaylistListItem from "../components/playlist/PlaylistListItem"
import { Playlist } from "interfaces"

const arrayOfPlaylistComps = (playlists: Playlist[]): ReactElement[] | [] =>
	playlists.map((playlist: Playlist) => (
		<PlaylistListItem
			key={playlist._id}
			id={playlist._id}
			name={playlist.name}
			slug={playlist.slug}
			shareLink={playlist.share_link}
		/>
	))

export default arrayOfPlaylistComps
