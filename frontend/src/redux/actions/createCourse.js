import axios from "../../axios/configuratedAxios";
import {
    FETCH_COURSES_TAGS,
    FETCH_COURSES_TAGS_ERROR,
    FETCH_COURSES_PARTNERS,
    FETCH_COURSES_PARTNERS_ERROR,
    FETCH_COURSES_SCOPES,
    FETCH_COURSES_SCOPES_ERROR,
} from "./actionTypes";

export function fetchCoursesTags() {
    return async(dispatch) => {
        try {
            const response = await axios.get("courses/coursestags/");
            dispatch(fetchCoursesTagsSuccess(response.data.results));
        } catch (error) {
            dispatch(fetchCoursesTagsError(error));
        }
    };
}

export function fetchCoursesTagsSuccess(coursesTags) {
    return {
        type: FETCH_COURSES_TAGS,
        coursesTags: coursesTags,
    };
}

export function fetchCoursesTagsError(error) {
    return {
        type: FETCH_COURSES_TAGS_ERROR,
        error: error,
    };
}

// export function fetchCoursesPartners() {
//     return async(dispatch) => {
//         try {
//             const response = await axios.get("courses/partners/");
//             console.log(response.data)
//             dispatch(fetchCoursesPartnersSuccess(response.data.results));
//         } catch (error) {
//             dispatch(fetchCoursesPartnersError(error));
//         }
//     };
// }

// export function fetchCoursesPartnersSuccess(coursesPartners) {
//     return {
//         type: FETCH_COURSES_PARTNERS,
//         coursesPartners: coursesPartners,
//     };
// }

// export function fetchCoursesPartnersError(error) {
//     return {
//         type: FETCH_COURSES_PARTNERS_ERROR,
//         error: error,
//     };
// }

// export function fetchCoursesScopes() {
//     return async(dispatch) => {
//         try {
//             const response = await axios.get("courses/scopes/");
//             dispatch(fetchCoursesScopesSuccess(response.data.results));
//         } catch (error) {
//             dispatch(fetchCoursesScopesError(error));
//         }
//     };
// }

// export function fetchCoursesScopesSuccess(coursesScopes) {
//     return {
//         type: FETCH_COURSES_SCOPES,
//         coursesScopes: coursesScopes,
//     };
// }

// export function fetchCoursesScopesError(error) {
//   return {
//     type: FETCH_COURSES_SCOPES_ERROR,
//     error: error,
//   };
// }


