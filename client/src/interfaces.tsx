export interface ICreatePlaylistState {
	name: string
	slug: string
	errors: TError
}

type TError = {
	[key: string]: any
}

export interface ICreatePlaylistProps {
	name: string
	slug: string
	id?: string
	createPlaylist(arg0: object): any
}

export interface INewPlaylist {
	name: string
	slug: string
	id?: string | null
}

export interface SongResponse {
	name: string
	album: string
	artists: SongResponseArtist[]
	image: string
	spotId: string
	duration_ms: string
	uri: string
}

export interface SongResponseArtist {
	external_urls: external_urls
	href: string
	id: string
	name: string
	type: string
	uri: string
}

type external_urls = {
	spotify: string
}

export type Playlists = {
	loading: boolean
	playlist: {}
	playlists: Playlist[]
}

export type Playlist = {
	collaborative: boolean
	user: string
	name: string
	slug: string
	desc: string
	createdAt: string
	_id: string
	__v: number
}

export type User = {
	avatar: string
	exp: number
	iat: number
	id: string
	username: string
}

export type Auth = {
	isAuthenticated: boolean
	user: User
}
