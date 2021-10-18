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

export interface Song {
	name: string
	album: string
	artists: Array<Artist>
}

export interface Artist {
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
