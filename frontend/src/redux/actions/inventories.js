import axios from "../../axios/configuratedAxios";
import {
  FETCH_INVENTORIES,
  FETCH_INVENTORIES_ERROR,
  CLEAR_INVENTORIES,
} from "./actionTypes";

export function fetchInventories(url) {
  return async (dispatch) => {
    try {
      const response = await axios.get(url);
      dispatch(fetchInventoriesSuccess(response.data));
    } catch (error) {
      dispatch(fetchInventoriesError(error));
    }
  };
}

export function fetchPageInventories(url) {
  return async (dispatch, getState) => {
    try {
      const inventoriesData = getState().inventories.inventories.data;
      const response = await axios.get(url);
      const updatedInventories = inventoriesData && inventoriesData.results ? {
        ...inventoriesData,
        results: inventoriesData.results.concat(response.data.results),
        next: response.data.next
      } : response.data;
      dispatch(fetchInventoriesSuccess(updatedInventories));
    } catch (error) {
      dispatch(fetchInventoriesError(error));
    }
  };
}

export function fetchOrderedInventories(url) {
  return async (dispatch, getState) => {
    try {
      const inventoriesData = getState().inventories.inventories.data;
      const response = await axios.get(url);
      const updatedStudents = {
        ...inventoriesData,
        results: [...inventoriesData.results.slice(0, 20), ...response.data.results],
        next: response.data.next
      };
      dispatch(fetchInventoriesSuccess(updatedStudents));
    } catch (error) {
      dispatch(fetchInventoriesError(error));
    }
  };
}

export function fetchInventoriesSuccess(inventories) {
  return {
    type: FETCH_INVENTORIES,
    inventories: inventories,
  };
}

export function fetchInventoriesError(error) {
  return {
    type: FETCH_INVENTORIES_ERROR,
    error: error,
  };
}

export function clearInventories() {
  return {
    type: CLEAR_INVENTORIES,
  };
}