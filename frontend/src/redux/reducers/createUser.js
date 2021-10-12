import { START_LOADING, GET_CREATED_USER_ID, STOP_LOADING } from "../actions/actionTypes";


const initialState = {
  userId: null,
  loading: false,
};

export default function userCreateReducer(state = initialState, action) {
  switch (action.type){

    case START_LOADING:
      return {
        ...state,
        loading: true
      }

    case STOP_LOADING:
      return {
        ...state,
        loading: false
      }
    
    case GET_CREATED_USER_ID:
      return {
        ...state,
        userId: action.userId,
      }
    default:
        return state;
  }
}