import { loadPersistedState } from '../utils/persist';

export const createStore = (initialState, reducer, middlewares = [], persistConfig) => {
  let state = loadPersistedState(initialState, persistConfig) || initialState;
  const listeners = new Set();

  function persistState(newState) {
    if (!persistConfig) return;

    const toPersist = persistConfig.whitelist
      ? Object.fromEntries(
        Object.entries(newState).filter(([key]) => persistConfig.whitelist.includes(key))
      )
      : newState;
    localStorage.setItem(persistConfig.key, JSON.stringify(toPersist));
  }

  const getState = () => state;

  const setState = (newState) => {
    state = newState;
    persistState(newState);
    listeners.forEach((listener) => listener());

  };

  const dispatch = (action) => {
    const nextState = reducer(state, action);
    setState(nextState);
  };

  const middlewareAPI = {
    getState,
  };

  const Mydispatch = middlewares
    .reverse()
    .reduce((next, mw) => {
      return mw(middlewareAPI)(next)
    }, dispatch)
    ;


  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };


  return {
    getState, subscribe, dispatch: Mydispatch
  }
}