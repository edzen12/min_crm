import {
  FETCH_COURSES_TAGS,
  FETCH_COURSES_TAGS_ERROR,
  FETCH_COURSES_PARTNERS,
  FETCH_COURSES_PARTNERS_ERROR,
  FETCH_COURSES_SCOPES,
  FETCH_COURSES_SCOPES_ERROR,
} from "../actions/actionTypes";

const initialState = {
  tags: {
    data: [],
    error: null,
  },
  partners: {
    data: [],
    error: null,
  },
  scopes: {
    data: [],
    error: null,
  },
};

export default function courseCreateReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COURSES_TAGS:
      return {
        ...state,
        tags: {
          data: action.coursesTags,
          error: null,
        },
      };
    case FETCH_COURSES_TAGS_ERROR:
      return {
        ...state,
        tags: {
          data: {},
          error: action.error,
        },
      };
    case FETCH_COURSES_PARTNERS:
      return {
        ...state,
        partners: {
          data: action.coursesPartners,
          error: null,
        },
      };
    case FETCH_COURSES_PARTNERS_ERROR:
      return {
        ...state,
        partners: {
          data: {},
          error: action.error,
        },
      };
    case FETCH_COURSES_SCOPES:
      return {
        ...state,
        scopes: {
          data: action.coursesScopes,
          error: null,
        },
      };
    case FETCH_COURSES_SCOPES_ERROR:
      return {
        ...state,
        scopes: {
          data: {},
          error: action.error,
        },
      };
    default:
      return state;
  }
}
