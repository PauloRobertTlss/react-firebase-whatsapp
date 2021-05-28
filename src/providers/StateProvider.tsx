import React, { createContext, useReducer } from "react";
const StateContext = createContext<any>({});

const StateProvider = ({ reducer, initialState, children }) => (

    <StateContext.Provider value={
        useReducer(reducer, initialState)
    }>
    {children}
  </StateContext.Provider>
);

export { StateProvider, StateContext };