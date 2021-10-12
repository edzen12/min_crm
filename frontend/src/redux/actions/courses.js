import axios from "../../axios/configuratedAxios";
import {
  FETCH_COURSES_SUCCESS,
  FETCH_COURSES_ERROR,
  FETCH_COURSES_DETAIL,
  FETCH_COURSES_DETAIL_ERROR,
  CLEAR_COURSES,
} from "./actionTypes";

export function fetchCourses(url) {
  return async (dispatch) => {
    try {
      const response = await axios.get(url);
      dispatch(fetchCoursesSuccess(response.data));
    } catch (error) {
      dispatch(fetchCoursesError(error));
    }
  };
}

export function fetchPageCourses(url) {
  return async (dispatch, getState) => {
    try {
      const coursesData = getState().courses.courses.data;
      const response = await axios.get(url);
      const updatedCourses = coursesData
        ? {
            ...coursesData,
            results: coursesData.results.concat(response.data.results),
            next: response.data.next
          }
        : response.data;
      dispatch(fetchCoursesSuccess(updatedCourses));
    } catch (error) {
      dispatch(fetchCoursesError(error));
    }
  };
}

export function fetchOrderedCourses(url) {
  return async (dispatch, getState) => {
    try {
      const coursesData = getState().courses.courses.data;
      const response = await axios.get(url);
      const updatedCourses = {
        ...coursesData,
        results: [
          ...coursesData.results.slice(0, 20),
          ...response.data.results,
        ],
        next: response.data.next
      };
      dispatch(fetchCoursesSuccess(updatedCourses));
    } catch (error) {
      dispatch(fetchCoursesError(error));
    }
  };
}

export function fetchCoursesSuccess(courses) {
  return {
    type: FETCH_COURSES_SUCCESS,
    courses: courses,
  };
}

export function fetchCoursesError(error) {
  return {
    type: FETCH_COURSES_ERROR,
    error: error,
  };
}

export function fetchCourseDetailAction(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`courses/${id}`);
      dispatch(courseDetailAction(response.data));
    } catch (error) {
      dispatch(courseDetailActionError(error));
    }
  };
}

export function courseDetailAction(courseDetail) {
  return {
    type: FETCH_COURSES_DETAIL,
    courseDetail: courseDetail,
  };
}

export function courseDetailActionError(error) {
  return {
    type: FETCH_COURSES_DETAIL_ERROR,
    error: error,
  };
}

export function clearCourses() {
  return {
    type: CLEAR_COURSES,
  };
}
