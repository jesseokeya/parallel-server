import React, { useReducer } from "react";

export const Store = React.createContext();

const initialState = {
  snapshots: {}
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SNAPSHOTS":
      return { ...state, snapshots: action.payload };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
