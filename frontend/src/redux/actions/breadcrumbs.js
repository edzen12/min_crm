import {SET_BREADCRUMBS, CLEAR_BREADCRUMBS} from "./actionTypes";

export function clearBreadcrumbs() {
  return {
    type: CLEAR_BREADCRUMBS,
  };
}

export function setBreadcrumbs(data) {
  return {
    type: SET_BREADCRUMBS,
    data
  };
}