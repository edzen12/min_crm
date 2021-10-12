import axios from "../../axios/configuratedAxios";
import {
  FETCH_USERS,
  FETCH_USERS_ERROR,
  CLEAR_USERS,
} from "./actionTypes";

export function fetchUsers(url, usersType) {
  return async (dispatch) => {
    try {
      const response = await axios.get(url);
      dispatch(fetchUsersSuccess(response.data, usersType));
    } catch (error) {
      dispatch(fetchUsersError(error, usersType));
    }
  };
}

export function fetchPageUsers(url, usersType) {
  return async (dispatch, getState) => {
    try {
      const adminsData = getState().getUsers.students.data;
      const response = await axios.get(url);
      const updatedAdmins = adminsData ? {
        ...adminsData,
        results: adminsData.results.concat(response.data.results),
        next: response.data.next
      } : response.data;
      dispatch(fetchUsersSuccess(updatedAdmins, usersType));
    } catch (error) {
      dispatch(fetchUsersError(error, usersType));
    }
  };
}

export function fetchOrderedUsers(url, usersType) {
  return async (dispatch, getState) => {
    try {
      const studentsData = getState().getUsers.students.data;
      const response = await axios.get(url);
      const updatedStudents = {
        ...studentsData,
        results: [...studentsData.results.slice(0, 20), ...response.data.results],
        next: response.data.next
      };
      dispatch(fetchUsersSuccess(updatedStudents, usersType));
    } catch (error) {
      dispatch(fetchUsersError(error, usersType));
    }
  };
}

export function fetchUsersSuccess(users, usersType) {
  return {
    type: FETCH_USERS,
    users: users,
    usersType: usersType,
  };
}

export function fetchUsersError(error, usersType) {
  return {
    type: FETCH_USERS_ERROR,
    error: error,
    usersType: usersType,
  };
}

export function clearUsers(usersType) {
  return {
    type: CLEAR_USERS,
    usersType: usersType
  };
}