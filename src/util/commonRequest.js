import Promise from "bluebird";
import services from "../services";
import request from "../util/request";
import Constant from "../constant";
import store from "../main";
import { showSuccess, showError } from "../store/common";

export function sendEmail({ mailTo, emailSubject, emailBody, file }) {
    return (dispatch) => {
        const requestData = {
            data: {
                mailTo,
                emailSubject,
                emailBody,
                base64: file.base64,
                fileName: file.fileName,
                fileExtension: file.fileExtension,
            },
        };
        return new Promise((resolve) => {
            request
                .post(services.sendEmail)
                .send(requestData)
                .end((err, res) => {
                    if (res.body.data && res.body.response.status.code === 0) {
                        dispatch(showSuccess({ message: Constant.SUCCESS_SEND_EMAIL + mailTo }));
                    } else {
                        dispatch(showError({ message: Constant.FAILTURE_SEND_EMAIL }));
                    }
                    resolve(res);
                });
        });
    };
}

export const readLeadNotification = (notificationId, userId) => {
    return new Promise((resolve, reject) => {
        let requestData = {
            data: {
                loginUserId: userId,
                leadNotificationId: notificationId,
            },
        };
        request
            .post(services.readLeadNotification)
            .send(requestData)
            .end((err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
    });
};

export const getLeadNofitication = (userId) => {
    return new Promise((resolve, reject) => {
        let requestData = {
            data: {
                loginUserId: userId,
            },
        };
        request
            .post(services.getLeadNotifications)
            .send(requestData)
            .end((err, res) => {
                if (err) {
                    reject(`${res.error}`);
                } else {
                    resolve(res.body.data);
                }
            });
    });
};

export const downloadPerformanceRanking = (regionId = false, teamId = false, metric) => {
    const userId = store.getState().login.user.id;
    const requestData = {
        data: {
            loginUserId: userId,
            regionId: regionId ? regionId : "",
            teamId: teamId ? teamId : "",
            metric: metric,
        },
    };

    return new Promise((resolve, reject) => {
        request
            .post(services.downloadPdDashBoardReport)
            .send(requestData)
            .end((err, res) => {
                if (err) {
                    reject(`${res.error}`);
                } else {
                    resolve(res.body.data);
                }
            });
    });
};

export const readNotification = (notificationId, userId) => {
    return new Promise((resolve, reject) => {
        let requestData = {
            data: {
                loginUserId: userId,
                userNotificationId: notificationId,
            },
        };
        request
            .post(services.readUserNotification)
            .send(requestData)
            .end((err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
    });
};
