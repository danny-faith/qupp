import React from 'react';

const MyContext = React.createContext();

export const MyProvider = MyContext.Provider;
export const MyConsumer = MyContext.Consumer;