import { FETCH_BRANCHES_ERROR, FETCH_BRANCHES_SUCCESS } from "../actions/actionTypes";


const initialState = {
    branches: {
        data: null,
        error: null,
    },
};

export default function branchesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_BRANCHES_SUCCESS:
            return {
                ...state,
                branches: {
                    data: action.branches,
                    error: null,
                },
            };
        case FETCH_BRANCHES_ERROR:
            return {
                ...state,
                branches: {
                    data: {},
                    error: action.error,
                },
            };
        default:
            return state;
    }
}