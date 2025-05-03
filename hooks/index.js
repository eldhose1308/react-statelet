import { useContext, useSyncExternalStore } from "react";
import { StateletContext } from "../context/StateletProvider.jsx";

const useStore = () => useContext(StateletContext);

const useStatelet = (selector) => {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
};

const useStateletDispatch = () => {
  const store = useStore();
  return store.dispatch;
};

const useCreateStateletAction = (type) => {
  const store = useStore();

  return (payload) => {
    store.dispatch({ type, payload })
  }
};

export {
  useStateletDispatch,
  useStatelet,
  useCreateStateletAction
}