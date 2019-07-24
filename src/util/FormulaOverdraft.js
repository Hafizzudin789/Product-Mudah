import * as _ from "lodash";

const ConvertToStringArray = (arr) => {
    return _.map(arr, _.toString);
};

const ConvertToNumberArray = (arr) => {
    return _.map(arr, _.toNumber);
};

export const calculateAmountUtilized = (limit, endingLimit) => {
    let lmt = _.toNumber(limit);
    let endLimit = _.toNumber(endingLimit);
    let result = lmt - endLimit;

    return _.toString(result);
};

export const calculateDaysUtilized = (dayInMonth) => {
    let days = JSON.parse(JSON.stringify(dayInMonth)); // deep clone

    _.map(days, (obj) => {
        return _.set(obj, "day", _.toNumber(obj.day));
    });

    let result = [];
    result[0] = days[1].day - days[0].day;
    result[1] = days[2].day - days[1].day;
    result[2] = days[3].day - days[2].day;
    result[3] = 31 - days[3].day + 1;

    return ConvertToStringArray(result);
};

export const calculateAvgUtilizationAmt = (amountUtilized, daysUtilized) => {
    let amount = ConvertToNumberArray(amountUtilized);
    let day = ConvertToNumberArray(daysUtilized);

    let products = _.map(amount, (amt, i) => {
        return amt * day[i];
    });

    let sumProd = _.sum(products);
    let sumDay = _.sum(day);
    let result = _.round(sumProd / sumDay);

    return _.toString(result);
};

export const calculateInterestCharged = (amountUtilized, daysUtilized, interestRate) => {
    let interest = _.toNumber(interestRate) / 100;
    let fraction = interest / 365;

    let amount = ConvertToNumberArray(amountUtilized);
    let day = ConvertToNumberArray(daysUtilized);

    let result = _.map(amount, (amt, i) => {
        return amt * day[i] * fraction;
    });

    let round_result = _.map(result, (val) => {
        return _.round(val, 2);
    });

    return ConvertToStringArray(round_result);
};

export const calculateAvgUtilization = (avgUtilizationAmount, limit) => {
    let amount = _.toNumber(avgUtilizationAmount);
    let lmt = _.toNumber(limit);

    let percent = (amount / lmt) * 100;

    let result = _.round(percent, 2);

    return _.toString(result);
};

export const calculateTotalInterest = (interestCharged) => {
    let interest = ConvertToNumberArray(interestCharged);

    let sum = _.sum(interest);

    let result = _.round(sum);

    return _.toString(result);
};

export const calculateTotalCommitmentFee = (commitmentFee, limit, avgUtilization) => {
    let fee = _.toNumber(commitmentFee) / 100;
    let lmt = _.toNumber(limit);
    let avgUtil = _.toNumber(avgUtilization) / 100;

    let result = (fee / 365) * 31 * (1 - avgUtil) * lmt;
    let round_result = _.round(result);

    return _.toString(round_result);
};

export const calculateTotalCharges = (totalInterest, totalCommitmentFee) => {
    let interest = _.toNumber(totalInterest);
    let fee = _.toNumber(totalCommitmentFee);

    let result = interest + fee;

    return _.toString(result);
};

export const calculateOutstandingBalance = (transaction) => {
    let trans = JSON.parse(JSON.stringify(transaction)); // deep clone
    let outStandingBalance1 = parseInt(trans[0].amount);
    let outStandingBalance2 = parseInt(trans[0].amount);
    let outStandingBalance3 = parseInt(trans[0].amount);
    let outStandingBalance4 = parseInt(trans[0].amount);
    if (trans[1].nature == "Credit") {
        outStandingBalance2 = outStandingBalance1 - parseInt(trans[1].amount);
    } else {
        outStandingBalance2 = outStandingBalance1 + parseInt(trans[1].amount);
    }
    if (trans[2].nature == "Credit") {
        outStandingBalance3 = outStandingBalance2 - parseInt(trans[2].amount);
    } else {
        outStandingBalance3 = outStandingBalance2 + parseInt(trans[2].amount);
    }
    if (trans[3].nature == "Credit") {
        outStandingBalance4 = outStandingBalance3 - parseInt(trans[3].amount);
    } else {
        outStandingBalance4 = outStandingBalance3 + parseInt(trans[3].amount);
    }

    const outStandingBalances = [outStandingBalance1, outStandingBalance2, outStandingBalance3, outStandingBalance4];
    return ConvertToStringArray(outStandingBalances);
};

const Limit = {
    START: {},
    END: {},
};

const calculateAvailableLimit = (limit, transaction) => {
    let lmt = _.toNumber(limit);
    let trans = JSON.parse(JSON.stringify(transaction)); // deep clone

    _.map(trans, (obj) => {
        return _.set(obj, "amount", _.toNumber(obj.amount));
    });

    let start = [];
    let end = [];

    _.map(trans, (trx, i) => {
        if (i === "0") {
            start[i] = lmt;
            end[i] = trx.nature === "Credit" ? start[i] + trx.amount : start[i] - trx.amount;
        } else {
            start[i] = end[i - 1];
            end[i] = trx.nature === "Credit" ? start[i] + trx.amount : start[i] - trx.amount;
        }
    });

    Limit.START = { type: "starting", value: ConvertToStringArray(start) };
    Limit.END = { type: "ending", value: ConvertToStringArray(end) };
};

export const calculateStartingLimit = (limit, transaction) => {
    calculateAvailableLimit(limit, transaction);
    return Limit.START;
};

export const calculateEndingLimit = () => {
    return Limit.END;
};
