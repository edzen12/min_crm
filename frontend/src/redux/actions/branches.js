import axios from "../../axios/configuratedAxios";
import { FETCH_BRANCHES_ERROR, FETCH_BRANCHES_SUCCESS } from "./actionTypes";

export function fetchBranches() {
    return async(dispatch) => {
        try {
            const response = await axios.get("branches/");
            dispatch(fetchBranchesSuccess(response.data));
        } catch (error) {
            dispatch(fetchBranchesError(error));
        }
    };
}

export function fetchBranchesSuccess(branches) {
    return {
        type: FETCH_BRANCHES_SUCCESS,
        branches: branches,
    };
}

export function fetchBranchesError(error) {
    return {
        type: FETCH_BRANCHES_ERROR,
        error: error,
    };
}