import {
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_ERROR,
  FETCH_COURSES_DETAIL,
  FETCH_COURSES_DETAIL_ERROR,
  CLEAR_COURSES,
} from "../actions/actionTypes";

const initialState = {
  courses: {
    data: null,
    error: null,
  },
  courseDetail: {
    data: null,
    error: null
  }
};

export default function courseReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_COURSES_SUCCESS:
      return {
        ...state,
        courses: {
          error: null,
          data: action.courses,
        }
      };
    case FETCH_COURSES_ERROR:
      return {
        ...state,
        courses: {
          errorMessage: action.error
        },
      };
    case FETCH_COURSES_DETAIL:
      return {
        ...state,
        courseDetail: {data: action.courseDetail},
      };
    case FETCH_COURSES_DETAIL_ERROR:
      return {
        ...state,
        courseDetail: {error: action.error},
      };
    case CLEAR_COURSES:
      return {
        ...state,
        courses: {
          data: null,
          error: null,
        },
      };
    default:
      return state;
  }
}