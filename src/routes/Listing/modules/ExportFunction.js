import Promise from "bluebird";
import Action from "./ActionConstants";
import services from "../../../services";
import request from "../../../util/request";

export function getData() {
    return (dispatch, store) => {
        const requestData = {
            data: {
            },
        };
        return new Promise((resolve) => {
            request.get(services.getData).send(requestData).end((error, res) => {
                // console.log({res})
                dispatch({ type: Action.GET_DATA, payload: res.body });
            });
        });
    };
}

