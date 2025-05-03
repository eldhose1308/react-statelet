import React, { createContext } from 'react';
import { createStore } from '../store/store';

export const StateletContext = createContext();

const StateletProvider = ({ children, value }) => {
  const { initialState, reducer, middlewares, persistConfig } = value;
  const store = createStore(initialState, reducer, middlewares, persistConfig);

  return (
    <StateletContext.Provider value={store}>
      {children}
    </StateletContext.Provider>
  );
};

export default StateletProvider;