import update from "react/lib/update";
import Permission from "../../../util/Permission";

const handleGetData = (state, action) => ({
    ...state,
    theData: action.payload.data
})

export default {
    GET_DATA: handleGetData,
};
