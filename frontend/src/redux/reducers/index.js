import { combineReducers } from "redux";
import courseReducer from "./course";
import courseCreateReducer from "./createCourse"
import userCreateReducer from "./createUser";
import getUsersReduscer from "./getUsers";
import klassDetailReducer from "./klassDetail";
import inventoriesReducer from "./inventory"
import financeReducer from "./finance";
import studentReducer from "./student";
import examsReducer from "./exams";
import branchesReducer from "./branches"
import personalDataReducer from "./personalData"
import klassesReducer from './klasses';
import breadcrumbs from "./breadCrumbs";

export default combineReducers({
    courses: courseReducer,
    courseCreate: courseCreateReducer,
    userCreate: userCreateReducer,
    getUsers: getUsersReduscer,
    klassDetail: klassDetailReducer,
    finance: financeReducer,
    student: studentReducer,
    exams: examsReducer,
    branches: branchesReducer,
    inventories:inventoriesReducer,
    personalData: personalDataReducer,
    klasses: klassesReducer,
    breadcrumbs
});