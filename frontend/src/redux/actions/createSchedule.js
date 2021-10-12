import { ADD_NEW_FIELDS } from "./actionTypes";

export function createScheduleField(id) {
    return {
        type: ADD_NEW_FIELDS,
        id: id
    };
}