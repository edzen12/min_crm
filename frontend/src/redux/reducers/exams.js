import {
  FETCH_EXAMS_START,
  FETCH_EXAMS_SUCCESS,
  FETCH_EXAMS_ERROR,
  SET_EXAMS_RESULTS_ID,
} from "../actions/actionTypes";


const initialState = {
  exams: [],
  examsResultId: null,
  loading: false,
  error: null
};

export default function examsReducer(state = initialState, action){
  switch (action.type) {
    case FETCH_EXAMS_START:
      return {
        ...state, 
        loading: true
      }
    case FETCH_EXAMS_SUCCESS:
      return {
        ...state,
        exams: action.exams,
        loading: false,
      }
    case FETCH_EXAMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case SET_EXAMS_RESULTS_ID:
      return {
        ...state,
        examsResultId: action.id
      }
    default:
      return state;
  }
}