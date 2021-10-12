import { ADD_NEW_FIELDS } from "../actions/actionTypes";

const initialState = {
    schedulesFields: []
};

export default function createScheduleFieldReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_NEW_FIELDS:
            return {
                ...state,
                schedulesFields: [...state.schedulesFields, {
                    id: action.id,
                    title: "",
                    klass: null,
                    day: null,
                    material: null,
                    start_time: null,
                    end_time: null,
                    homework_link: ""
                }]

            };
        default:
            return state;
    }
}