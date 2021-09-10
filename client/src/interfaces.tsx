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
