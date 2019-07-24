import * as _ from "lodash";

export const calculateGapDays = (inventoryDays, receivableDays, supplierDays) => {
    let inventory = _.toNumber(inventoryDays);
    let receivable = _.toNumber(receivableDays);
    let supplier = _.toNumber(supplierDays);

    let result = _.round(inventory + receivable - supplier);

    return { type: "capitalGapDays", value: _.toString(result) };
};

export const calculateWorkingCapitalNeeds = (monthlyRevenue, grossProfitMargin, capitalGapDays) => {
    let revenue = _.toNumber(monthlyRevenue);
    let margin = _.toNumber(grossProfitMargin);
    let days = _.toNumber(capitalGapDays);

    let fraction = margin / 100;
    let cost = revenue * (1 - fraction);
    let avg = cost / 31;
    let result = _.round(avg * days);

    return { type: "workingCapitalNeeds", value: _.toString(result) };
};

export const calculateWorkingCapitalGap = (workingCapitalNeeds, workingCapitalExisting) => {
    let capNeeds = _.toNumber(workingCapitalNeeds);
    let capExist = _.toNumber(workingCapitalExisting);
    let result = capNeeds - capExist;

    return { type: "workingCapitalGap", value: _.toString(result) };
};

export const calculateSupplierDays = (accountsPayable, payableCost) => {
    let payable = _.toNumber(accountsPayable);
    let cost = _.toNumber(payableCost);

    let result = payable / (cost / 365);
    let round_result = isNaN(result) ? 0 : _.round(result);

    return { type: "supplierDays", value: _.toString(round_result) };
};

export const calculateInventoryDays = (inventory, inventoryCost) => {
    let _inventory = _.toNumber(inventory);
    let cost = _.toNumber(inventoryCost);

    let result = (_inventory / cost) * 365;
    let round_result = isNaN(result) ? 0 : _.round(result);

    return { type: "inventoryDays", value: _.toString(round_result) };
};

export const calculateReceivableDays = (accountsReceivable, receivableRevenue) => {
    let receivable = _.toNumber(accountsReceivable);
    let revenue = _.toNumber(receivableRevenue);

    let result = (receivable / revenue) * 365;
    let round_result = isNaN(result) ? 0 : _.round(result);

    return { type: "receivableDays", value: _.toString(round_result) };
};
