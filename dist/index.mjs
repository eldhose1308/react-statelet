import React, { createContext, useSyncExternalStore, useContext } from 'react';

const mergePersisitedAndInitialValues = (initialState, persistedState, whitelist = []) => {
  let persistedJSON = {};
  try {
    persistedJSON = JSON.parse(persistedState);
  } catch (err) {
    console.error(err);
    return initialState;
  }
  const whitelistedPersistedData = Object.keys(persistedJSON).reduce((acc, persistedKey) => {
    if (whitelist.includes(persistedKey)) {
      return {
        ...acc,
        [persistedKey]: persistedJSON[persistedKey]
      };
    }
  }, {});
  return {
    ...initialState,
    ...whitelistedPersistedData
  };
};
const loadPersistedState = (initialState, persistConfig) => {
  const {
    key,
    whitelist
  } = persistConfig || {};
  if (!key) return initialState;
  const persisted = localStorage.getItem(key);
  try {
    return mergePersisitedAndInitialValues(initialState, persisted, whitelist);
  } catch {
    return initialState;
  }
};

const createStore = (initialState, reducer, middlewares = [], persistConfig) => {
  let state = loadPersistedState(initialState, persistConfig) || initialState;
  const listeners = new Set();
  function persistState(newState) {
    if (!persistConfig) return;
    const toPersist = persistConfig.whitelist ? Object.fromEntries(Object.entries(newState).filter(([key]) => persistConfig.whitelist.includes(key))) : newState;
    localStorage.setItem(persistConfig.key, JSON.stringify(toPersist));
  }
  const getState = () => state;
  const setState = newState => {
    state = newState;
    persistState(newState);
    listeners.forEach(listener => listener());
  };
  const dispatch = action => {
    const nextState = reducer(state, action);
    setState(nextState);
  };
  const middlewareAPI = {
    getState
  };
  const Mydispatch = middlewares.reverse().reduce((next, mw) => {
    return mw(middlewareAPI)(next);
  }, dispatch);
  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return {
    getState,
    subscribe,
    dispatch: Mydispatch
  };
};

const StoreContext = /*#__PURE__*/createContext();
const StoreProvider = ({
  children,
  value
}) => {
  const {
    initialState,
    reducer,
    middlewares,
    persistConfig
  } = value;
  const store = createStore(initialState, reducer, middlewares, persistConfig);
  return /*#__PURE__*/React.createElement(StoreContext.Provider, {
    value: store
  }, children);
};

const useStore = () => useContext(StoreContext);
const useStatelet = selector => {
  const store = useStore();
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()), () => selector(store.getState()));
};
const useStateletDispatch = () => {
  const store = useStore();
  return store.dispatch;
};
const useCreateStateletAction = type => {
  const store = useStore();
  return payload => {
    store.dispatch({
      type,
      payload
    });
  };
};

export { StoreProvider, useCreateStateletAction, useStatelet, useStateletDispatch };
//# sourceMappingURL=index.mjs.map
