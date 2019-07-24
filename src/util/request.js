import store from "../main";
import request from "superagent";
import service from "../services";
import Constant from "../constant";
import { showLoader, hideLoader, showError, showSuccess } from "../store/common";

request.Request.prototype.finalEnd = request.Request.prototype.end;

request.Request.prototype.end = function(callback) {
    this.finalEnd((err, res) => {
        store.dispatch(hideLoader());
        if (err && err.message.indexOf("the network is offline") > -1) {
            store.dispatch(
                showError({
                    message: Constant.ERROR_NO_INTERNET,
                    callbackAferError: () => (window.location.pathname = "./"),
                }),
            );
        } else {
            callback(err, res);
        }
    });
};

request.Request.prototype.finalSend = request.Request.prototype.send;

request.Request.prototype.send = function(postParams) {
    if (store.getState().login && store.getState().login.user && postParams.data && !postParams.data.loginUserId) {
        postParams.data.loginUserId = store.getState().login.user.id;
    }
    return this.finalSend(postParams);
};

var requestWrapper = function(method, hideTheLoader = false) {
    return function(url, hideLoader) {
        if (!hideLoader && !hideTheLoader) store.dispatch(showLoader());
        return request[method](service.baseURL + url)
            // .set("sessiontoken", store.getState().login ? store.getState().login.sessionToken : "111111")
            .type("json")
            .timeout(300000);
    };
};

function dispatch(data, dispatch, store) {
    if (typeof data.requestData === "function") {
        data.requestData = data.requestData(store);
    }
    dispatchEvent(
        dispatch,
        data.service,
        data.requestData,
        data.handler,
        data.msgSuccess,
        data.handleAfterSuccess,
        data.renderData,
        data.handleAfterFail,
    );
}

function dispatchEvent(dispatch, service, requestData, handler, message, handleAfterSuccess, renderData, handleAfterFail) {
    return new Promise((resolve) => {
        requestWrapper("post")(service)
            .send(requestData)
            .end((error, res) => {
                if (res.body && res.body.data && res.body.response.status.code === 0) {
                    message &&
                        dispatch(
                            showSuccess({ message: message, callbackAferSuccess: () => (handleAfterSuccess ? handleAfterSuccess() : {}) }),
                        );
                    handler && dispatch({ type: handler, payload: res.body.data });
                    !message && typeof handleAfterSuccess === "function" && renderData && handleAfterSuccess(res.body.data, dispatch);
                    !message && typeof handleAfterSuccess === "function" && !renderData && handleAfterSuccess();
                } else {
                    dispatch(
                        showError({
                            message:
                                res.body && res.body.response && res.body.response.status && res.body.response.status.message
                                    ? res.body.response.status.message
                                    : "Error",
                        }),
                    );
                    handleAfterFail && typeof handleAfterFail === "function";
                    handleAfterFail(res.body && res.body.response && res.body.response.status, dispatch);
                }
                resolve(res);
            });
    });
}

function initData() {
    return {
        service: "",
        requestData: "",
        handler: "",
        msgSuccess: "",
        renderData: false,
        handleAfterSuccess: null,
        handleAfterFail: null,
    };
}

export default {
    get: requestWrapper("get"),
    put: requestWrapper("put"),
    post: requestWrapper("post"),
    del: requestWrapper("del"),
    postWithoutLoader: requestWrapper("post", true),
    dispatch: dispatch,
    initData: initData,
};
