import React from 'react';

const defaultValues = {
    nowPlaying: {
        // TODO: solve issue where if the below is missing then upNext and nowPlaying break (.map)
        name: '',
        artists: [],
        album: '',
        duration_ms: '' ,
        spotId: ''
      },
      upNext: {
        name: '',
        artists: [],
        album: '',
        duration_ms: '' ,
        spotId: ''
      }
}

const MyContext = React.createContext(defaultValues);

export const MyProvider = MyContext.Provider;
export const MyConsumer = MyContext.Consumer;