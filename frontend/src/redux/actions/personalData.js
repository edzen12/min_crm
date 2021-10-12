import {
  PERSONAL_DATA,
  PERSONAL_DATA_ERROR,
  FETCHED_PERSONAL_DATA,
  FETCHED_PERSONAL_DATA_ERROR,
} from "./actionTypes";
import axios from "../../axios/configuratedAxios";

export function fetchProfileData(url) {
  return async(dispatch) => {
    try {
      const response = await axios.get(url);
      dispatch(profileDataAction(response.data));
    } catch (error) {
      dispatch(profileDataActionError(error));
    }
  };
}

export function profileDataAction(profileData) {
  return {
    type: PERSONAL_DATA,
    profileData: profileData,
  };
}

export function profileDataActionError(error) {
  return {
    type: PERSONAL_DATA_ERROR,
    error: error,
  };
}

export function fetchUserData() {
  return async(dispatch) => {
    try {
      const response = await axios.get("users/current-user/");
      const {is_trainer, is_staff_member, is_administrator, is_student} = response.data;
      const profileId = response.data.profile_id;
      is_trainer && dispatch(fetchProfileData(`users/trainers/${profileId}/`));
      is_staff_member && dispatch(fetchProfileData(`users/staff-members/${profileId}/`));
      is_administrator && dispatch(fetchProfileData(`users/administrators/${profileId}/`));
      is_student && dispatch(fetchProfileData(`users/students/${profileId}/`));
      dispatch(fetchedUserDataAction(response.data));
    } catch (error) {
      dispatch(fetchedUserDataActionError(error));
    }
  };
}

export function fetchedUserDataAction(userData) {
  return {
    type: FETCHED_PERSONAL_DATA,
    userData: userData,
  };
}

export function fetchedUserDataActionError(error) {
  return {
    type: FETCHED_PERSONAL_DATA_ERROR,
    error: error,
  };
}