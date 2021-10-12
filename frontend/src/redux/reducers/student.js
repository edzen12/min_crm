import {
    STUDENTS_LIST_GET_REQUEST,
    STUDENTS_LIST_GET_REQUEST_ERROR,
    STUDENT_DETAIL_GET_REQUEST,
    STUDENT_DETAIL_GET_REQUEST_ERROR,
} from "../actions/actionTypes";

const initialState = {
    studentsList: {
        data: [],
        loading: false,
        error: null,
    },
    studentDetail: {
        data: null,
        error: null
    }
};

export default function studentReducer(state = initialState, action) {
    switch (action.type) {
        case STUDENTS_LIST_GET_REQUEST:
            return {
                ...state,
                studentsList: {
                    data: action.studentsList,
                    error: null
                },
            };
        case STUDENTS_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                studentsList: {
                    error: action.error
                },
            };
        case STUDENT_DETAIL_GET_REQUEST:
            return {
                ...state,
                studentDetail: {
                    data: action.studentDetail,
                    error: null
                },
            };
        case STUDENT_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                studentDetail: { error: action.error },
            };
        default:
            return state;
    }
}