import * as _ from "lodash";

const ConvertToNumberObjects = (collection, prop) => {
    return _.map(collection, (obj) => {
        return _.set(obj, prop, _.toNumber(obj[prop]));
    });
};

const ConvertToStringObjects = (collection, type) => {
    return _.map(collection, (val, i) => {
        return Object.assign({ type: type, index: i, value: _.toString(val) });
    });
};

const Property = {
    timeline: ["tenure", "availableLimit", "newWithdrawal", "outstanding", "principalRepayment", "interestCharges", "total"],
    backup: ["withdrawal", "payment", "paymentAmount"],
};

const Result = {
    AVAILABLE_LIMIT: {},
    NEW_WITHDRAWAL: {},
    OUTSTANDING: {},
    PRINCIPAL_REPAYMENT: {},
    INTEREST_CHARGES: {},
    TOTAL: {},
};

const Backup = {
    WITHDRAWAL: {},
    PAYMENT: {},
    PAYMENT_AMOUNT: {},
};

const calculateBackupPayment = (days, backupWithdrawal) => {
    let backPayment = [];

    _.map(backupWithdrawal, (val, i) => {
        if (val === null) {
            backPayment[i] = null;
        } else {
            backPayment[i] = val + days;
        }
    });

    return backPayment;
};

const checkTenure = (keys, value) => {
    return _.findIndex(keys, (key) => {
        return key === value;
    });
};

const calculatePrincipal = (backup) => {
    let keys = ["0", "30", "60", "90", "120", "150", "180", "210", "240", "270", "300", "330", "360"];
    let principal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    _.map(backup, (val) => {
        let index = checkTenure(keys, _.toString(val.payment));

        if (index >= 0) {
            principal[index] = val.paymentAmount;
        }
    });

    return principal;
};

const calculateCharges = (principal, interest, days) => {
    let charges = [];

    _.map(principal, (val, i) => {
        return (charges[i] = val * ((interest / 365) * days));
    });

    return charges;
};

const calculateSum = (principal, charges) => {
    let sum = _.map(principal, (val, i) => {
        let _charge = _.map(charges, (charge) => {
            return Object.assign({}, { charge: charge });
        });

        return Object.assign(_charge[i], { principal: val });
    });

    let total = [];

    _.map(sum, (val, i) => {
        total[i] = val.principal + val.charge;
    });

    return total;
};

const calculateBalance = (timeline, principal) => {
    let _timeline = JSON.parse(JSON.stringify(timeline)); // deep clone
    let collection = _.map(principal, (val, i) => {
        return Object.assign(_timeline[i], { principal: val });
    });

    let balance = [];

    _.map(collection, (val, i) => {
        if (i === 0) {
            balance[i] = val.newWithdrawal;
        } else {
            balance[i] = balance[i - 1] + val.newWithdrawal - val.principal;
        }
    });

    return balance;
};

const calculateAvailLimit = (timeline, limit, balance) => {
    let _timeline = JSON.parse(JSON.stringify(timeline)); // deep clone
    let collection = _.map(balance, (val, i) => {
        return Object.assign(_timeline[i], { balance: val });
    });

    let availLimit = [];

    _.map(collection, (val, i) => {
        availLimit[i] = limit - val.balance;
    });

    return availLimit;
};

const calculateBankerTimeline = (totalLimit, tenure, interestRate, withdrawalTimeline) => {
    let limit = _.toNumber(totalLimit);
    let days = _.toNumber(tenure);
    let interest = _.toNumber(interestRate) / 100;
    let timeline = JSON.parse(JSON.stringify(withdrawalTimeline)); // deep clone

    _.map(Property.timeline, (prop) => {
        return ConvertToNumberObjects(timeline, prop);
    });

    let backWithdrawal = [];
    let backPaymentAmount = [];

    _.map(timeline, (val, i) => {
        if (i === "0") {
            // index is string because the initialState is set as string
            backWithdrawal[i] = val.newWithdrawal !== 0 ? val.tenure : null;
            backPaymentAmount[i] = val.newWithdrawal !== 0 ? val.newWithdrawal : null;
        } else {
            backWithdrawal[i] = val.newWithdrawal !== 0 ? val.tenure : null;
            backPaymentAmount[i] = val.newWithdrawal !== 0 ? val.newWithdrawal : null;
        }
    });

    let backPayment = calculateBackupPayment(days, backWithdrawal);

    let backup = _.map(backPayment, (payment, i) => {
        let _backup = _.map(backPaymentAmount, (amount) => {
            return Object.assign({}, { paymentAmount: amount });
        });
        return Object.assign(_backup[i], { payment: payment });
    });

    let principal = calculatePrincipal(backup);

    let charges = calculateCharges(principal, interest, days);

    let total = calculateSum(principal, charges);

    let balance = calculateBalance(timeline, principal);

    let availLimit = calculateAvailLimit(timeline, limit, balance);

    Backup.WITHDRAWAL = ConvertToStringObjects(backWithdrawal, "withdrawal");

    Backup.PAYMENT = ConvertToStringObjects(backPayment, "payment");

    Backup.PAYMENT_AMOUNT = ConvertToStringObjects(backPaymentAmount, "paymentAmount");

    Result.AVAILABLE_LIMIT = ConvertToStringObjects(availLimit, "availableLimit");

    Result.OUTSTANDING = ConvertToStringObjects(balance, "outstanding");

    Result.PRINCIPAL_REPAYMENT = ConvertToStringObjects(principal, "principalRepayment");

    Result.INTEREST_CHARGES = ConvertToStringObjects(charges, "interestCharges");

    Result.TOTAL = ConvertToStringObjects(total, "total");
};

export const calculateAvailableLimit = (totalLimit, tenure, interestRate, withdrawalTimeline) => {
    calculateBankerTimeline(totalLimit, tenure, interestRate, withdrawalTimeline);
    return Result.AVAILABLE_LIMIT;
};

export const calculateOutstanding = () => {
    return Result.OUTSTANDING;
};

export const checkWithdrawal = () => {
    return Backup.WITHDRAWAL;
};

export const checkPayment = () => {
    return Backup.PAYMENT;
};

export const lookupPaymentAmount = () => {
    return Backup.PAYMENT_AMOUNT;
};

export const calculatePrincipalRepayment = () => {
    return Result.PRINCIPAL_REPAYMENT;
};

export const calculateInterestCharges = () => {
    return Result.INTEREST_CHARGES;
};

export const calculateTotal = () => {
    return Result.TOTAL;
};

export const calculateTotalCharges = () => {
    let result = _.reduce(
        Result.INTEREST_CHARGES,
        (sum, charge) => {
            return sum + _.toNumber(charge.value);
        },
        0,
    );

    return { type: "totalCharges", value: _.toString(result) };
};
