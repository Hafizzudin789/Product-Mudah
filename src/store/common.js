import Promise from "bluebird";
import services from "../services";
import request from "../util/request";
import update from "react/lib/update";

const initState = {
    error: null,
    success: null,
    loaded: false,
    reqCount: 0,
    unReadCountLead: 0,
    isCustomerView: false,
    callbackAferError: null,
    callbackAferSuccess: null,
    systemNotifications: {
        leads: {},
        news: {},
    },
    logout: false,
    notifyDashboard: false,
    closedNotification: false,
};

export const LOG_OUT = "LOG_OUT";
export const SHOW_ERROR = "SHOW_ERROR";
export const HIDE_ERROR = "HIDE_ERROR";
export const SHOW_LOADER = "SHOW_LOADER";
export const HIDE_LOADER = "HIDE_LOADER";
export const SHOW_SUCCESS = "SHOW_SUCCESS";
export const HIDE_SUCCESS = "HIDE_SUCCESS";
export const CUSTOMER_VIEW = "CUSTOMER_VIEW";
export const GET_UNREAD_LEAD = "GET_UNREAD_LEAD";
export const UPDATE_UNREAD_LEAD = "UPDATE_UNREAD_LEAD";
export const GET_SYSTEM_NOTIFICATIONS = "GET_SYSTEM_NOTIFICATIONS";
export const UPDATE_SYSTEM_NOTIFICATIONS = "UPDATE_SYSTEM_NOTIFICATIONS";
export const GET_EMAIL_NOTIFICATIONS = "GET_EMAIL_NOTIFICATIONS";
export const CLOSE_NOTIFICATIONS = "CLOSE_NOTIFICATIONS";

export const ACTION_HANDLERS = {
    LOG_OUT: handleLogout,
    SHOW_ERROR: handleShowError,
    HIDE_ERROR: handleHideError,
    SHOW_LOADER: handleShowLoader,
    HIDE_LOADER: handleHideLoader,
    SHOW_SUCCESS: handleShowSuccess,
    HIDE_SUCCESS: handleHideSuccess,
    CUSTOMER_VIEW: handleCustomerView,
    GET_UNREAD_LEAD: handleGetUnreadLead,
    UPDATE_UNREAD_LEAD: handleUpdateUnreadLead,
    GET_SYSTEM_NOTIFICATIONS: handleGetSystemNotifications,
    UPDATE_SYSTEM_NOTIFICATIONS: handleUpdateSystemNotifications,
    GET_EMAIL_NOTIFICATIONS: handleGetEmailNotifications,
    CLOSE_NOTIFICATIONS: handleCloseNotification,
};

function handleCloseNotification(state) {
    return update(state, {
        closedNotification: {
            $set: true,
        },
    });
}

function handleGetSystemNotifications(state, action) {
    return update(state, {
        systemNotifications: {
            leads: {
                $set: action.payload,
            },
        },
    });
}

function handleUpdateSystemNotifications(state, action) {
    const { unreadLeadsCount, unreadLeads } = state.systemNotifications.leads;

    let newNotifications = unreadLeads.filter((lead) => lead.leadId !== action.payload.leadId);

    return update(state, {
        systemNotifications: {
            leads: {
                unreadLeadsCount: {
                    $set: unreadLeadsCount > 0 ? unreadLeadsCount - 1 : 0,
                },
                unreadLeads: {
                    $set: newNotifications,
                },
            },
        },
    });
}

function handleGetEmailNotifications(state, action) {
    let _show = action.payload && action.payload.message && action.payload.message.length > 0 ? true : false;

    return update(state, {
        notifyDashboard: {
            $set: _show,
        },
    });
}

function handleCustomerView(state) {
    return update(state, {
        isCustomerView: {
            $set: !state.isCustomerView,
        },
    });
}

function handleGetUnreadLead(state, action) {
    return update(state, {
        unReadCountLead: {
            $set: action.payload,
        },
    });
}

function handleUpdateUnreadLead(state) {
    return update(state, {
        unReadCountLead: {
            $set: state.unReadCountLead > 0 ? state.unReadCountLead - 1 : 0,
        },
    });
}

function handleShowLoader(state) {
    let count = state.reqCount + 1;
    return update(state, {
        loaded: {
            $set: true,
        },
        reqCount: {
            $set: count,
        },
    });
}

function handleLogout(state) {
    window.location.pathname = "./";
    return update(state, {
        logout: {
            $set: false,
        },
    });
}

function handleHideLoader(state) {
    let count = state.reqCount <= 0 ? 0 : state.reqCount - 1;
    return update(state, {
        reqCount: {
            $set: count,
        },
        loaded: {
            $set: count <= 0 ? false : true,
        },
    });
}

function handleShowError(state, action) {
    return update(state, {
        error: {
            $set: action.payload.message,
        },
        callbackAferError: {
            $set: action.payload.callbackAferError,
        },
    });
}

function handleHideError(state) {
    if (state.callbackAferError) state.callbackAferError();
    return update(state, {
        error: {
            $set: null,
        },
    });
}

function handleShowSuccess(state, action) {
    return update(state, {
        success: {
            $set: action.payload.message,
        },
        callbackAferSuccess: {
            $set: action.payload.callbackAferSuccess,
        },
    });
}

function handleHideSuccess(state) {
    if (state.callbackAferSuccess) state.callbackAferSuccess();
    return update(state, {
        success: {
            $set: null,
        },
    });
}

export function showLoader(payload) {
    return { type: SHOW_LOADER, payload };
}

export function hideLoader(payload) {
    return { type: HIDE_LOADER, payload };
}

export function showError(payload) {
    return { type: SHOW_ERROR, payload };
}

export function hideError(payload) {
    return { type: HIDE_ERROR, payload };
}

export function showSuccess(payload) {
    return { type: SHOW_SUCCESS, payload };
}

export function hideSuccess(payload) {
    return { type: HIDE_SUCCESS, payload };
}

export function getUnreadLead(payload) {
    return { type: GET_UNREAD_LEAD, payload };
}

export function updateUnreadLead(payload) {
    return { type: UPDATE_UNREAD_LEAD, payload };
}

export function customerView(payload) {
    return { type: CUSTOMER_VIEW, payload };
}

export function getSystemNotifications(payload) {
    return { type: GET_SYSTEM_NOTIFICATIONS, payload: payload };
}

export function updateSystemNotifications(payload) {
    return { type: UPDATE_SYSTEM_NOTIFICATIONS, payload: payload };
}

export function getEmailNotifications(payload) {
    return { type: GET_EMAIL_NOTIFICATIONS, payload: payload };
}

export function logout() {
    return (dispatch) => {
        return new Promise((resolve) => {
            const requestData = {
                data: {},
            };
            sessionStorage.setItem("BrdCrm", null);
            request
                .post(services.logout)
                .send(requestData)
                .end((error, res) => {
                    dispatch({ type: LOG_OUT, payload: res.body });
                    resolve(res);
                });
        });
    };
}

export const getSystemNotification = (userId) => (dispatch) => {
    return new Promise((resolve, reject) => {
        let requestData = {
            data: {
                loginUserId: userId,
            },
        };
        request
            .post(services.systemNotifications)
            .send(requestData)
            .end((err, res) => {
                if (err) {
                    reject(`${res.error}`);
                } else {
                    dispatch({
                        type: "GET_SYSTEM_NOTIFICATIONS",
                        payload: res.body.data,
                    });
                    resolve(res.body.data);
                }
            });
    });
};

export const commonDispatch = {
    logout,
    showError,
    hideError,
    showLoader,
    hideLoader,
    showSuccess,
    hideSuccess,
    customerView,
};

export const commonState = (state) => ({
    ...state.common,
});

export default function commonReducer(state = initState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
