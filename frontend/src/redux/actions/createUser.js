import { START_LOADING, GET_CREATED_USER_ID, STOP_LOADING } from './actionTypes';


export function startLoading(){
  return {
    type: START_LOADING
  }
}

export function stopLoading(){
  return {
    type: STOP_LOADING
  }
}


export function getUserId(userId){
  return {
    type: GET_CREATED_USER_ID,
    userId: userId
  }
}


