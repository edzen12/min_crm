import {
    FETCH_USERS,
    FETCH_USERS_ERROR,
    CLEAR_USERS,
} from "../actions/actionTypes";

const initialState = {
    admins: {
        data: null,
        error: null,
    },
    trainers: {
        data: null,
        error: null
    },
    staffMembers: {
        data: null,
        error: null,
    },
    students: {
        data: null,
        error: null,
    },
};

export default function getUserReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                [action.usersType]: {
                    data: action.users,
                    error: null,
                },
            };
        case CLEAR_USERS:
            return {
                ...state,
                [action.usersType]: {
                    data: null,
                    error: null,
                },
            };
        case FETCH_USERS_ERROR:
            return {
                ...state,
                [action.usersType]: {
                    data: {},
                    error: action.error,
                },
            };
        default:
            return state;
    }
}