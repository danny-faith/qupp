function populateNowPlaying(play) {
    let nowPlaying = {...this.state.nowPlaying};
    nowPlaying = this.state.playlist.queue[0];
    const playBool = (play) ? this.playSong : null;
    this.setState({nowPlaying}, playBool);
}

export {
    // playNextSong,
    populateNowPlaying,
    // populateNowPlaying2,
    // populateUpNext,
}
