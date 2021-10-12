import {
  PERSONAL_DATA,
  PERSONAL_DATA_ERROR,
  FETCHED_PERSONAL_DATA,
  FETCHED_PERSONAL_DATA_ERROR,
} from "../actions/actionTypes";

const initialState = {
  userData: {
    data: null,
    error: null,
  },
  profileData: {
    data: null,
    error: null
  }
};

export default function personalDataReducer(state = initialState, action) {
  switch (action.type) {
    case PERSONAL_DATA:
      return {
        ...state,
        profileData: {
          data: action.profileData,
          error: null
        },
      };
    case PERSONAL_DATA_ERROR:
      return {
        ...state,
        profileData: { error: action.error },
      };
    case FETCHED_PERSONAL_DATA:
      return {
        ...state,
        userData: {
          data: action.userData,
          error: null
        },
      };
    case FETCHED_PERSONAL_DATA_ERROR:
      return {
        ...state,
        userData: {
          error: action.error
        },
      };
    default:
      return state;
  }
}