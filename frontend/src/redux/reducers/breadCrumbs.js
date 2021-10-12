import { CLEAR_BREADCRUMBS, SET_BREADCRUMBS } from "../actions/actionTypes";

const initialState = {
  breadcrumbs: [],
};

export default function breadcrumbsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BREADCRUMBS:
      return {
        ...state,
        breadcrumbs: action.data,
      };
    case CLEAR_BREADCRUMBS:
      return {
        ...state,
        breadcrumbs: [],
      };
    default:
      return state;
  }
}