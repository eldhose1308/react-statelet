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
      }
    }
  }, {})

  return { ...initialState, ...whitelistedPersistedData };
}

export const loadPersistedState = (initialState, persistConfig) => {
  const { key, whitelist } = persistConfig || {};

  if (!key) return initialState;

  const persisted = localStorage.getItem(key);
  try {
    return mergePersisitedAndInitialValues(initialState, persisted, whitelist)
  } catch {
    return initialState;
  }
}
