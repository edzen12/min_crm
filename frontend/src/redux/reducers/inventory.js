import { FETCH_INVENTORIES_ERROR ,FETCH_INVENTORIES } from "../actions/actionTypes";


const initialState = {
  inventories: {
    data: null,
    error: null,
  },
};

export default function inventoriesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INVENTORIES:
      return {
        ...state,
        inventories: {
          data: action.inventories,
          error: null,
        },
      };
    case FETCH_INVENTORIES_ERROR:
      return {
        ...state,
        inventories: {
          data: {},
          error: action.error,
        },
      };
    default:
      return state;
  }
}