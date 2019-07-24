import _ from "lodash";
import Constant from "../constant";
import Validation from "./validations";

const generatePipelineData = (data, filter, searchCriteria) => {
    let dataAfterFilter = Validation.filterLeadByStatusAndColor(data);
    if (filter) {
        dataAfterFilter = _.filter(dataAfterFilter, (data) => {
            return filterBySelection(data, filter);
        });
    }
    if (searchCriteria.length > 0) {
        dataAfterFilter = _.filter(dataAfterFilter, (data) => {
            return filterBySearchText(data, searchCriteria);
        });
    }
    let object = [
        {
            title: "Generated",
            leads: 0,
            overdue: 0,
            data: [],
        },
        {
            title: "Contacted",
            leads: 0,
            overdue: 0,
            data: [],
        },
        {
            title: "Submitted",
            leads: 0,
            data: [],
        },
        {
            title: "Converted",
            leads: 0,
            data: [],
        },
    ];
    dataAfterFilter.forEach((dt) => {
        switch (checkStatusGroup(dt.level1Status.name)) {
            case "Generated":
                if (Validation.checkCodeColor(dt.colorCode) === "red-notify") {
                    object[0].overdue = object[0].overdue + 1;
                }
                object[0].leads = object[0].leads + 1;
                object[0].data.push(dt);
                break;
            case "Contacted":
                if (Validation.checkCodeColor(dt.colorCode) === "red-notify") {
                    object[1].overdue = object[1].overdue + 1;
                }
                object[1].leads = object[1].leads + 1;
                object[1].data.push(dt);
                break;
            case "Submitted":
                object[2].leads = object[2].leads + 1;
                object[2].data.push(dt);
                break;
            case "Converted":
                object[3].leads = object[3].leads + 1;
                object[3].data.push(dt);
                break;
            default:
                break;
        }
    });
    return object;
};

const filterBySearchText = (data, search) => {
    const { customer, contactPerson } = data;
    const searchFormat = search.toLowerCase().trim();
    let exist = false;
    if (customer && customer.companyName) {
        exist =
            customer.companyName
                .toLowerCase()
                .trim()
                .indexOf(searchFormat) > -1;
    }
    if (customer && customer.companyRegNo && !exist) {
        exist =
            customer.companyRegNo
                .toLowerCase()
                .trim()
                .indexOf(searchFormat) > -1;
    }
    if (contactPerson && contactPerson.name && !exist) {
        exist =
            contactPerson.name
                .toLowerCase()
                .trim()
                .indexOf(searchFormat) > -1;
    }
    return exist;
};

const filterBySelection = (data, filter) => {
    if (filter === Constant.STATUS_ALL) {
        return true;
    } else if (filter === Constant.PRIORITY) {
        return data.priorityStar && data.leadSource === Constant.MANUAL;
    } else if (filter === Constant.ASSIGNED) {
        return data.assigned;
    } else if (filter === Constant.DUE_SOON) {
        return data.colorCode === "#FFFF00";
    } else {
        return data.colorCode === "#FF0000";
    }
};

const checkStatusGroup = (status) => {
    if (
        status === Constant.FIRST_MEETING_SCHEDULED ||
        status === Constant.FOLLOW_UP_MEETING_SCHEDULED ||
        status === Constant.APPLICATION_INITIATED ||
        status === Constant.FOLLOW_UP_MEETING_SCHEDULED_1 ||
        status === Constant.ONE_MEETING_SCHEDULED
    ) {
        return Constant.STATUS_CONTACTED;
    } else if (status === Constant.APPLICATION_SUBMITTED || status === Constant.PARTIALLY_SUBMITTED) {
        return Constant.STATUS_SUBMITTED;
    } else if (status === Constant.CONVERTED) {
        return Constant.STATUS_CONVERTED;
    } else if (
        status === Constant.CUSTOMER_UNREACHABLE ||
        status === Constant.CUSTOMER_NOT_INTERESTED ||
        status === Constant.APPLICATION_REJECTED ||
        status === Constant.CUSTOMER_DECLINED_OFFER ||
        status === Constant.CUSTOMER_UNSUITABLE ||
        status === Constant.CLOSED_BY_SYSTEM
    ) {
        return Constant.STATUS_CLOSED;
    } else {
        return Constant.STATUS_GENERATED;
    }
};

export default {
    generatePipelineData,
};
