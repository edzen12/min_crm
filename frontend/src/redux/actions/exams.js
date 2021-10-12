import axios from "../../axios/configuratedAxios";
import {
  FETCH_EXAMS_START,
  FETCH_EXAMS_SUCCESS,
  FETCH_EXAMS_ERROR,
  SET_EXAMS_RESULTS_ID
} from "./actionTypes";


export function fetchExams(){
  return dispatch => {
    dispatch(fetchExamsStart());

    axios.get("examinations/exams/") 
      .then(response => {
        dispatch(fetchExamsSuccess(response.data.results));

      })
      .catch(error => {
        console.log(error.response)
        dispatch(fetchExamsError(error.response));
      })
  }
}

export function fetchExamsSuccess(exams){
  return {
    type: FETCH_EXAMS_SUCCESS,
    exams: exams
  }
}

export function fetchExamsStart(){
  return {
    type: FETCH_EXAMS_START,
    loading: true
  }
}

export function fetchExamsError(error){
  return {
    type: FETCH_EXAMS_ERROR,
    error: error
  }
}

export function setExamsResultsId(id){
  return {
    type: SET_EXAMS_RESULTS_ID,
    id: id
  }
}