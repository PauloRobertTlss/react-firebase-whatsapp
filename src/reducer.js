
export const initialState =
    JSON.parse(localStorage.getItem("firebase")) || {use: null};

export const actionTypes = {
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      localStorage.setItem("firebase", JSON.stringify({user: action.user}));
      return {
        ...state,
        user: action.user
      };
    case actionTypes.LOGOUT:
      localStorage.removeItem("firebase");
      return {
        ...state,
        user: null
      };

    default:
      return state;
  }
};

export default reducer;
