import axios from "../../axios/configuratedAxios";
import { FETCH_KLASS_DETAIL_START, FETCH_KLASS_DETAIL_SUCCESS, FETCH_KLASS_DETAIL_ERROR } from "./actionTypes";


export function fetchKlassDetail(klassId) {
  return async (dispatch) => {
    dispatch(fetchKlassDetailStart());
		try {
			const response = await axios.get(`/klasses/${klassId}/`);
      dispatch(fetchKlassDetailSuccess(response.data));
		} catch (error) {
			dispatch(fetchKlassDetailError(error));
		}
  };
}

export function fetchKlassDetailStart() {
	return {
			type: FETCH_KLASS_DETAIL_START,
	};
}

export function fetchKlassDetailSuccess(klassDetail) {
	return {
			type: FETCH_KLASS_DETAIL_SUCCESS,
			klassDetail: klassDetail
	}
}

export function fetchKlassDetailError(error) {
	return {
			type: FETCH_KLASS_DETAIL_ERROR,
			error: error
	}
}