import axios from "../../axios/configuratedAxios";
import {
    STUDENTS_LIST_GET_REQUEST,
    STUDENTS_LIST_GET_REQUEST_ERROR,
    STUDENT_DETAIL_GET_REQUEST,
    STUDENT_DETAIL_GET_REQUEST_ERROR,
} from "./actionTypes";


export function fetchStudentsListAction() {
    return async(dispatch) => {
        try {
            const response = await axios.get("users/students/");
            dispatch(studentssLIstAction(response.data));
        } catch (error) {
            dispatch(studentssLIstActionError(error));
        }
    };
}

export function studentssLIstAction(studentsList) {
    return {
        type: STUDENTS_LIST_GET_REQUEST,
        studentsList: studentsList,
    };
}

export function studentssLIstActionError(error) {
    return {
        type: STUDENTS_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}

export function fetchStudentDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`users/students/${id}`);
            dispatch(studentDetailAction(response.data));
        } catch (error) {
            console.log(error)
        }
    };
}

export function studentDetailAction(studentDetail) {
    return {
        type: STUDENT_DETAIL_GET_REQUEST,
        studentDetail: studentDetail,
    };
}

export function studentDetailActionError(error) {
    return {
        type: STUDENT_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}