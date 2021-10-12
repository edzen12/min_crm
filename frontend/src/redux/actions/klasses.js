import axios from "../../axios/configuratedAxios";
import {
  FETCH_KLASSES_SUCCESS,
  FETCH_KLASSES_ERROR,
  CLEAR_KLASSES,
} from "./actionTypes";


export function fetchKlasses(url) {
  return async (dispatch) => {
    try {
      const response = await axios.get(url);
      dispatch(fetchKlassesSuccess(response.data));
    } catch (error) {
      dispatch(fetchKlassesError(error));
    }
  };
}

export function fetchPageKlasses(url) {
  return async (dispatch, getState) => {
    try {
      const klassesData = getState().klasses.klasses.data;
      const response = await axios.get(url);
      const updatedKlasses = klassesData
        ? {
            ...klassesData,
            results: klassesData.results.concat(response.data.results),
            next: response.data.next
          }
        : response.data;
      dispatch(fetchKlassesSuccess(updatedKlasses));
    } catch (error) {
      dispatch(fetchKlassesError(error));
    }
  };
}

export function fetchOrderedKlasses(url) {
  return async (dispatch, getState) => {
    try {
      const klassesData = getState().klasses.klasses.data;
      const response = await axios.get(url);
      const updatedKlasses = {
        ...klassesData,
        results: [
          ...klassesData.results.slice(0, 20),
          ...response.data.results,
        ],
        next: response.data.next
      };
      dispatch(fetchKlassesSuccess(updatedKlasses));
    } catch (error) {
      dispatch(fetchKlassesError(error));
    }
  };
}

export function fetchKlassesSuccess(klasses) {
  return {
    type: FETCH_KLASSES_SUCCESS,
    klasses: klasses,
  };
}

export function fetchKlassesError(error) {
  return {
    type: FETCH_KLASSES_ERROR,
    error: error,
  };
}

export function clearKlasses() {
  return {
    type: CLEAR_KLASSES,
  };
}
