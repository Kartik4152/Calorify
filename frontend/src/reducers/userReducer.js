const initialState = {
  user: {
    id: 0,
    name: "",
    email: "",
    role: "user",
    calorielimit: 2000,
  },
  meals: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          calorielimit: action.payload.calorielimit,
        },
        meals: action.payload.meals,
      };
    case "SIGNOUT":
      return initialState;
    case "SET_CALORIES":
      return {
        meals: state.meals,
        user: {
          ...state.user,
          calorielimit: action.payload,
        },
      };
    case "SET_MEALS": {
      return {
        ...state,
        meals: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
