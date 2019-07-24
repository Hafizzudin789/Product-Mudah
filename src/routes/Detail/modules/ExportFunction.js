import Promise from "bluebird";
import Action from "./ActionConstants";
import services from "../../../services";
import request from "../../../util/request";

export function getDetail(payload) {
    return (dispatch) => {
        return new Promise((resolve) => {
            request
                .get(`${services.getDetail}${payload}`)
                .send()
                .end((err, res) => {
                    // console.log(res.body);
                    dispatch({ type: Action.GET_DETAIL, payload: res.body });
                    resolve(res);
                });
        });
    };
}

export function getSimilar(payload) {
    return (dispatch) => {
        return new Promise((resolve) => {
            request
                .get(`${services.getSimilar}${payload}`)
                .send()
                .end((err, res) => {
                    dispatch({ type: Action.GET_SIMILAR, payload: res.body });
                    resolve(res);
                });
        });
    };
}

