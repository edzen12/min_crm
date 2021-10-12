import {
  FETCH_KLASS_DETAIL_ERROR,
  FETCH_KLASS_DETAIL_START,
  FETCH_KLASS_DETAIL_SUCCESS,
} from "../actions/actionTypes";


const initialState = {
  klassDetail: {},
  schedules: [],
  loading: false,
  error: null
}

export default function klassDetailReducer(state = initialState, action){
  switch (action.type) {
    case FETCH_KLASS_DETAIL_START:
      return {
        ...state,
        loading: true
      }
    case FETCH_KLASS_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        klassDetail: action.klassDetail,
        schedules: [...action.klassDetail.schedules]
      }
    case FETCH_KLASS_DETAIL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state;
  }
}

