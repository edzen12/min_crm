import {
  FETCH_KLASSES_SUCCESS,
  FETCH_KLASSES_ERROR,
  CLEAR_KLASSES,
} from "../actions/actionTypes";

const initialState = {
  klasses: {
    data: null,
    error: null,
  }
};

export default function klassesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_KLASSES_SUCCESS:
      return {
        ...state,
        klasses: {
          error: null,
          data: action.klasses,
        }
      };
    case FETCH_KLASSES_ERROR:
      return {
        ...state,
        klasses: {
          errorMessage: action.error
        },
      };
    case CLEAR_KLASSES:
      return {
        ...state,
        klasses: {
          data: null,
          error: null,
        },
      };
    default:
      return state;
  }
}