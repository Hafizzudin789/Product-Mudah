import _ from "lodash";
import moment from "moment";
import services from "../services";
import Constant from "../constant";
const checkAlphaNumeric = (value) => {
    const regexAlphaNumeric = /^[a-z0-9\s]+$/i;
    return regexAlphaNumeric.test(value);
};

const checkCompanyName = (value) => {
    const regex = /^[a-z0-9\s!#$%&'*+-/=?^_`"(),:;<>@[\]\./\\]+$/i;
    return regex.test(value.trim());
};

const checkContactNameAndDirectorName = (value) => {
    const regex = /^[a-z0-9\s-'/@()\.]+$/i;
    return regex.test(value.trim());
};

const checkNumeric = (value) => {
    const regexNumeric = /^[0-9]+$/i;
    return regexNumeric.test(value);
};

const checkStaffId = (value) => {
    //UAT
    if (services.UATEnv) {
        if (!value || (value && value.length < 4)) {
            return false;
        }
    } else {
        if (!value || !checkNumeric(value) || (value && value.length !== 6)) {
            return false;
        }
    }
    return true;
};

const checkShowNotification = (data) => {
    let isOverDue = false;
    data.forEach((lead) => {
        if (!lead.read) {
            isOverDue = true;
        }
    });
    return isOverDue;
};

const checkUserRole = (value) => {
    if (value === "All") {
        return false;
    }
    return true;
};

const checkDecimal = (value) => {
    const regexDecimal = /^[0-9]*\.[0-9]{1,2}$/;
    return regexDecimal.test(value);
};

const checkEmail = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

const checkAddOfContactValidation = (company, pOCType) => {
    const error = {
        contactNameError: checkCommonValidation("contactName", company.contactName),
        contactTypeError: _.isEmpty(pOCType) ? Constant.ERROR_CONTACT_TYPE : null,
    };
    return isComplete(error);
};

const checkCodeColor = (code) => {
    switch (code) {
        case "#ef3e42":
        case "#FF0000":
            return "red-notify";
        case "#ff9933":
        case "#FFFF00":
            return "orange-notify";
        case "#3fce8e":
        case "#00FF00":
            return "green-notify";
        default:
            return "";
    }
};

const checkDuplicateContact = (store) => {
    let flag = false;
    const { contactName, contactEmail, contactNumber } = store.company;
    store.pOCs.forEach((pOC) => {
        if (pOC.contactName === contactName && pOC.contactEmail === contactEmail && pOC.contactNumber === contactNumber) {
            flag = true;
            return;
        }
    });
    return flag;
};

const checkDirectorValidation = (company) => {
    let error = {};
    if (!company.directorName || !checkContactNameAndDirectorName(company.directorName)) {
        error.name = Constant.ERROR_DIRECTOR_NAME;
    }
    return error;
};

const checkDuplicateDirector = (store) => {
    let flag = false;
    const { directorName, directorEmail, directorNumber } = store.company;
    store.directors.forEach((dir) => {
        if (dir.directorName === directorName && dir.directorEmail === directorEmail && dir.directorNumber === directorNumber) {
            flag = true;
            return;
        }
    });
    return flag;
};

const checkErrorServer = (res) => {
    if (res && res.body && res.body.response && res.body.response.status && res.body.response.status.code !== 0) {
        return res.body.response.status;
    }
    return null;
};

const checkOverrideFileUpload = (week, month, year, role, mtd, listFile) => {
    let object = { override: false, id: null };
    _.filter(listFile, (detail) => {
        return detail.fileType === "PD";
    }).forEach((file) => {
        if (
            !object.override &&
            removeSpaceAndLowerCase(file.week) === removeSpaceAndLowerCase(week) &&
            removeSpaceAndLowerCase(file.month) === removeSpaceAndLowerCase(month) &&
            removeSpaceAndLowerCase(file.year) === removeSpaceAndLowerCase(year) &&
            removeSpaceAndLowerCase(file.role.name) === removeSpaceAndLowerCase(role.name) &&
            mtd == (file.mtdFile ? true : false)
        ) {
            object.override = true;
            object.id = file.id;
        }
    });
    return object;
};

const checkOverrideFileUpload_v1 = (fileType, listFile) => {
    let object = { override: false, id: null };
    _.filter(listFile, (detail) => {
        return detail.fileType === "PD";
    }).forEach((file) => {
        if (!object.override && removeSpaceAndLowerCase(file.fileType) === removeSpaceAndLowerCase(fileType)) {
            object.override = true;
            object.id = file.id;
        }
    });
    return object;
};

const removeSpaceAndLowerCase = (value) => {
    return value
        .toString()
        .replace(/\s/g, "")
        .toLowerCase();
};

const checkCreateCustomerValidation = (company, industry, pOCs, companyType) => {
    let error = {
        companyNameError: Constant.ERROR_COMPANY_NAME,
        companyRegNoError: Constant.ERROR_COMPANY_REG_NO,
        firstLineAddressError: Constant.ERROR_FIRST_LINE_ADDRESS,
        cityError: Constant.ERROR_CITY,
        stateError: Constant.ERROR_STATE,
        postalCodeError: Constant.ERROR_POSTAL_CODE,
    };
    _.forIn(company, (value, key) => {
        error[key + "Error"] = checkCommonValidation(key, value);
    });
    error.industryError = !industry.id ? Constant.ERROR_INDUSTRY : null;
    error.companyTypeError = !companyType.id ? Constant.ERROR_COMPANY_TYPE : null;
    error.stateError = !company.state ? Constant.ERROR_STATE : null;
    if (pOCs.length === 0) {
        error.contactNameError = checkCommonValidation("contactName", company.contactName);
        error.contactTypeError = checkCommonValidation("contactType", company.contactType);
    } else {
        delete error.contactNameError;
        delete error.contactTypeError;
    }
    if (_.isEmpty(pOCs)) {
        error.errorEmptyPocs = Constant.ERROR_EMPTY_POCS;
    }
    delete error.directorNameError;
    delete error.directorEmailError;
    delete error.directorNumberError;
    delete error.directorBusinessError;

    return isComplete(error);
};

const checkPointOfContact = (pOCs, contactName, contactType) => {
    if (pOCs.length == 0) {
        return false;
    }
    if (contactName != undefined || !_.isEmpty(contactType)) {
        return false;
    }
    for (const i in pOCs) {
        if (checkCommonValidation("contactName", pOCs[i].contactName) !== null || _.isEmpty(pOCs[i].contactType)) {
            return false;
        }
    }
    let lastContact = pOCs.slice(-1)[0];
    if (!lastContact.contactName.trim() || _.isEmpty(lastContact.contactType)) {
        return false;
    }
    return true;
};

const isComplete = (error) => {
    let isComplete = true;
    _.forIn(error, (value) => {
        if (value) {
            isComplete = false;
            return;
        }
    });
    return isComplete;
};

const checkAdminCreateProduct = (product, selected) => {
    let errMsg = "";
    let error = {
        productIdError: Constant.ERROR_PRODUCT_ID,
        productNameError: Constant.ERROR_PRODUCT_NAME,
        productCategory: Constant.ERROR_PRODUCT_CATEGORY,
        productType: Constant.ERROR_PRODUCT_TYPE,
        productAvailable: Constant.ERROR_PRODUCT_AVAILABILITY,
        titleDesc: Constant.ERROR_PRODUCT_DESCRIPTION_TITLE,
        contentDesc: Constant.ERROR_PRODUCT_DESCRIPTION_CONTENT,
    };

    if ((product && product.productId === "") || (product && product.productId === undefined)) {
        errMsg = error.productIdError;
    } else if ((product && product.productName === "") || (product && product.productName === undefined)) {
        errMsg = error.productNameError;
    } else if (selected && selected.prodAvailability.name === "") {
        errMsg = error.productAvailable;
    } else if (selected && selected.prodCategories.name === "") {
        errMsg = error.productCategory;
    } else if (selected && selected.productType.name === "") {
        errMsg = error.productType;
    } else {
        errMsg = "";
    }

    return errMsg;
};

const checkAdminCreateProductDescription = (product) => {
    let errMsg = "";
    let error = {
        titleDesc: Constant.ERROR_PRODUCT_DESCRIPTION_TITLE,
        contentDesc: Constant.ERROR_PRODUCT_DESCRIPTION_CONTENT,
    };

    const isProductDescPass = () => {
        const err =
            product &&
            product.productDescriptions.map((e) => {
                let msg = "";
                if (e.title === "") {
                    msg = error.titleDesc;
                } else if (e.content === "") {
                    msg = error.contentDesc;
                } else {
                    msg = "";
                }
                return msg;
            });
        return err;
    };

    const isDescPass = isProductDescPass().find((e) => e !== "") || "";
    if (isDescPass !== "") {
        errMsg = isDescPass;
    } else {
        errMsg = "";
    }

    return errMsg;
};

const checkContactSpecialistProduct = (data) => {
    let errMsg = "";
    let error = {
        name: Constant.ERROR_SPECIALIST_NAME,
        job: Constant.ERROR_SPECIALIST_JOB,
        contact: Constant.ERROR_SPECIALIST_CONTACT,
        email: Constant.ERROR_SPECIALIST_EMAIL,
        ccEmail: Constant.ERROR_SPECIALIST_CCEMAIL,
    };

    if ((data && data.name === "") || (data && data.name === undefined)) {
        errMsg = error.name;
    } else if ((data && data.jobTitle === "") || (data && data.jobTitle === undefined)) {
        errMsg = error.job;
    } else if ((data && data.phone === "") || (data && data.phone === undefined)) {
        errMsg = error.contact;
    } else if ((data && data.email === "") || (data && data.email === undefined)) {
        errMsg = error.email;
    } else if ((data && data.ccEmail === "") || (data && data.ccEmail === undefined)) {
        errMsg = error.ccEmail;
    } else {
        errMsg = "";
    }

    return errMsg;
};

const checkProductDisclaimer = (data) => {
    let errMsg = "";
    let error = {
        disclaimer: Constant.ERROR_PRODUCT_DISCLAIMER,
    };

    if (
        (data && data.productDisclaimer.content && data.productDisclaimer.content === "") ||
        (data && data.productDisclaimer.content && data.productDisclaimer.content === undefined)
    ) {
        errMsg = error.disclaimer;
    } else if (_.isEmpty(data.productDisclaimer) || _.isEmpty(data.productDisclaimer.content)) {
        errMsg = error.disclaimer;
    } else if (data.productDisclaimer.content === "<p></p>" || data.productDisclaimer.content === "<p><br></p>") {
        errMsg = error.disclaimer;
    } else {
        errMsg = "";
    }

    return errMsg;
};

const checkAdminDetailProduct = (product, selectedCategory, productSpecialist) => {
    const error = {
        productIdError: Constant.ERROR_PRODUCT_ID,
        productNameError: Constant.ERROR_PRODUCT_NAME,
    };

    error.productIdError = checkCommonValidation("productId", product.productId);
    error.productNameError = checkCommonValidation("productName", product.productName);
    if (
        _.isNull(productSpecialist.name) &&
        _.isNull(productSpecialist.jobTitle) &&
        _.isNull(productSpecialist.phone) &&
        _.isNull(productSpecialist.email)
    ) {
        return;
    } else {
        error.productSpecialistNameError = checkCommonValidation("productSpecialistName", productSpecialist.name);
        error.productSpecialistJobTitleError = checkCommonValidation("productSpecialistJobTitle", productSpecialist.jobTitle);
        error.productSpecialistPhoneError = checkCommonValidation("productSpecialistContactNumber", productSpecialist.phone);
        error.productSpecialistEmailError = checkCommonValidation("productSpecialistEmail", productSpecialist.email);
    }

    return isComplete(error);
};

const checkAdminPublishProduct = (product, selectedCategory, productSpecialist, productDescriptions) => {
    const error = {
        productIdError: Constant.ERROR_PRODUCT_ID,
        productNameError: Constant.ERROR_PRODUCT_NAME,
        productCategoryError: Constant.ERROR_PRODUCT_CATEGORY,
        productDescriptionTitleError: Constant.ERROR.ERROR_PRODUCT_DESCRIPTION_TITLE,
        productSpecialistNameError: Constant.ERROR_PRODUCT_SPECIALIST_NAME,
        productSpecialistJobTitleError: Constant.ERROR_PRODUCT_SPECIALIST_JOB_TITLE,
        productSpecialistPhoneError: Constant.ERROR_PRODUCT_SPECIALIST_PHONE,
        productSpecialistEmailError: Constant.ERROR_PRODUCT_SPECIALIST_EMAIL,
    };

    error.productIdError = checkCommonValidation("productId", product.productId);
    error.productNameError = checkCommonValidation("productName", product.productName);
    error.productCategoryError = checkCommonValidation("productCategory", selectedCategory);

    _.forIn(productDescriptions, (val, key) => {
        error[key + "Error"] = checkCommonValidation(key, val);
    });

    return isComplete(error);
};

const checkStatusDropdown = (currentStatus, listStatus) => {
    switch (currentStatus.toLowerCase()) {
        case "pending initial contact":
            return _.filter(listStatus, (status) => {
                const { name } = status;
                return (
                    name === Constant.FIRST_MEETING_SCHEDULED ||
                    name === Constant.FOLLOW_UP_MEETING_SCHEDULED ||
                    name === Constant.APPLICATION_INITIATED ||
                    name === Constant.ONE_MEETING_SCHEDULED ||
                    name === Constant.CUSTOMER_UNREACHABLE ||
                    name === Constant.CUSTOMER_NOT_INTERESTED ||
                    name === Constant.CUSTOMER_UNSUITABLE ||
                    name === Constant.FOLLOW_UP_MEETING_SCHEDULED_1
                );
            });
        case "first meeting scheduled":
        case "1st meeting scheduled":
            return _.filter(listStatus, (status) => {
                const { name } = status;
                return (
                    name === Constant.FOLLOW_UP_MEETING_SCHEDULED_1 ||
                    name === Constant.FOLLOW_UP_MEETING_SCHEDULED ||
                    name === Constant.APPLICATION_INITIATED ||
                    name === Constant.CUSTOMER_NOT_INTERESTED ||
                    name === Constant.CUSTOMER_UNSUITABLE
                );
            });
        case "follow up meeting scheduled":
        case "follow-up meeting scheduled":
            return _.filter(listStatus, (status) => {
                const { name } = status;
                return (
                    name === Constant.APPLICATION_INITIATED ||
                    name === Constant.APPLICATION_SUBMITTED ||
                    name === Constant.PARTIALLY_SUBMITTED ||
                    name === Constant.CUSTOMER_NOT_INTERESTED ||
                    name === Constant.CUSTOMER_UNSUITABLE ||
                    name === Constant.KEEP_IN_VIEW
                );
            });
        case "application initiated":
            return _.filter(listStatus, (status) => {
                const { name } = status;
                return (
                    name === Constant.APPLICATION_SUBMITTED ||
                    name === Constant.PARTIALLY_SUBMITTED ||
                    name === Constant.CUSTOMER_NOT_INTERESTED ||
                    name === Constant.CUSTOMER_UNSUITABLE
                );
            });
        case "application submitted":
            return _.filter(listStatus, (status) => {
                const { name } = status;
                return name === Constant.CONVERTED || name === Constant.APPLICATION_REJECTED || name === Constant.CUSTOMER_DECLINED_OFFER;
            });
        default:
            return [];
    }
};

const checkByDaysValidation = (supplierDays, inventoryDays, receivableDays, monthlyRevenue, grossProfitMargin, workingCapitalExisting) => {
    let error = {
        supplierDaysError: Constant.ERROR_SUPPLIER_DAYS,
        receivableDaysError: Constant.ERROR_SUPPLIER_DAYS,
        inventoryDaysError: Constant.ERROR_INVENTORY_DAYS,
        monthlyRevenueError: Constant.ERROR_MONTHLY_REVENUE,
        grossProfitMarginError: Constant.ERROR_GROSS_PROFIT_MARGIN,
        workingCapitalExistingError: Constant.ERROR_WORKING_CAPITAL_EXISTING,
    };

    error.supplierDaysError = checkCommonValidation("supplierDays", supplierDays);
    error.receivableDaysError = checkCommonValidation("receivableDays", receivableDays);
    error.inventoryDaysError = checkCommonValidation("inventoryDays", inventoryDays);
    error.monthlyRevenueError = checkCommonValidation("monthlyRevenue", monthlyRevenue);
    error.grossProfitMarginError = checkCommonValidation("grossProfitMargin", grossProfitMargin);
    error.workingCapitalExistingError = checkCommonValidation("workingCapitalExisting", workingCapitalExisting);

    return isComplete(error);
};

const checkByBalanceSheetValidation = (
    accountsPayable,
    payableCost,
    inventory,
    inventoryCost,
    accountsReceivable,
    receivableRevenue,
    workingCapitalExisting,
) => {
    let error = {
        accountsPayableError: Constant.ERROR_ACCOUNTS_PAYABLE,
        payableCostError: Constant.ERROR_PAYABLE_COST,
        inventoryError: Constant.ERROR_INVENTORY,
        inventoryCostError: Constant.ERROR_INVENTORY_COST,
        accountsReceivableError: Constant.ERROR_ACCOUNTS_RECEIVABLE,
        receivableRevenueError: Constant.ERROR_RECEIVABLE_REVENUE,
        workingCapitalExistingError: Constant.ERROR_WORKING_CAPITAL_EXISTING,
    };

    error.accountsPayableError = checkCommonValidation("accountsPayable", accountsPayable);
    error.payableCostError = checkCommonValidation("payableCost", payableCost);
    error.inventoryError = checkCommonValidation("inventory", inventory);
    error.inventoryCostError = checkCommonValidation("inventoryCost", inventoryCost);
    error.accountsReceivableError = checkCommonValidation("accountsReceivable", accountsReceivable);
    error.receivableRevenueError = checkCommonValidation("receivableRevenue", receivableRevenue);
    error.workingCapitalExistingError = checkCommonValidation("workingCapitalExisting", workingCapitalExisting);

    return isComplete(error);
};

const checkOverdraftValidation = (interestRate, commitmentFee, limit, days, trx) => {
    let error = {
        interestRateError: Constant.ERROR_INTEREST_RATE,
        commitmentFeeError: Constant.ERROR_COMMITMENT_FEE,
        limitError: Constant.ERROR_LIMIT,
        "transactionAmount-0Error": Constant.ERROR_TRANSACTION_AMOUNT,
        "transactionAmount-1Error": Constant.ERROR_TRANSACTION_AMOUNT,
        "transactionAmount-2Error": Constant.ERROR_TRANSACTION_AMOUNT,
        "transactionAmount-3Error": Constant.ERROR_TRANSACTION_AMOUNT,
        "dayInMonth-0Error": Constant.ERROR_DAY_IN_MONTH,
        "dayInMonth-1Error": Constant.ERROR_DAY_IN_MONTH,
        "dayInMonth-2Error": Constant.ERROR_DAY_IN_MONTH,
        "dayInMonth-3Error": Constant.ERROR_DAY_IN_MONTH,
    };

    error.interestRateError = checkCommonValidation("interestRate", interestRate);
    error.commitmentFeeError = checkCommonValidation("commitmentFee", commitmentFee);
    error.limitError = checkCommonValidation("limit", limit);

    _.forIn(days, (val, key) => {
        error[key + "Error"] = checkCommonValidation(key, val);
    });

    _.forIn(trx, (val, key) => {
        error[key + "Error"] = checkCommonValidation(key, val);
    });

    return isComplete(error);
};

const checkBankerTimelineValidation = (totalLimit, interestRate, withdrawal) => {
    let error = {
        totalLimitError: Constant.ERROR_TOTAL_LIMIT,
        interestRateError: Constant.ERROR_INTEREST_RATE,
        "newWithdrawal-0Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-1Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-2Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-3Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-4Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-5Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-6Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-7Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-8Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-9Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-10Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-11Error": Constant.ERROR_NEW_WITHDRAWAL,
        "newWithdrawal-12Error": Constant.ERROR_NEW_WITHDRAWAL,
    };

    error.totalLimitError = checkCommonValidation("totalLimit", totalLimit);
    error.interestRateError = checkCommonValidation("interestRate", interestRate);

    _.forIn(withdrawal, (val, key) => {
        error[key + "Error"] = checkCommonValidation(key, val);
    });

    return isComplete(error);
};

const checkCreateLeadValidation = (company, pOC, category, smeProducts, crossSellingProducts, status) => {
    let error = {
        categoryError: Constant.ERROR_CATEGORY,
        companyNameError: Constant.ERROR_COMPANY_NAME,
        companyRegNoError: Constant.ERROR_COMPANY_REG_NO,
        statusError: Constant.ERROR_STATUS,
        potentialValueError: Constant.ERROR_POTENTIAL_VALUE,
        contactNameError: Constant.ERROR_CONTACT_NAME,
    };

    error.companyNameError = checkCommonValidation("companyName", company.companyName);
    error.companyRegNoError = checkCommonValidation("companyRegNo", company.companyRegNo);
    error.contactNameError = checkCommonValidation("contactName", pOC.contactName);

    error.categoryError = checkCommonValidation("category", category.name);
    error.statusError = checkCommonValidation("status", status.name);
    error.potentialValueError = checkCommonValidation("potentialValue", company.potentialValue);
    error.smeProductsError = smeProducts.length === 0 && crossSellingProducts.length === 0 ? Constant.ERROR_SME_PRODUCTS : null;
    error.leadRemark = company.leadRemark && company.leadRemark.length > 750 ? "Error lead remark" : null;

    delete error.industryError;
    delete error.contactEmailError;
    delete error.contactNumberError;
    delete error.contactBusinessError;
    delete error.contactTypeError;

    return isComplete(error);
};

const checkUpdateLeadValidation_s1 = (category, smeProducts, status, lead) => {
    let error = {
        categoryError: Constant.ERROR_CATEGORY,
        statusError: Constant.ERROR_STATUS,
        potentialValueError: Constant.ERROR_POTENTIAL_VALUE,
        divisionCodeError: Constant.ERROR_DIVISION_CODE,
        accountTypeError: Constant.ERROR_ACCOUNT_TYPE,
    };

    error.categoryError = checkCommonValidation("category", category.name);
    error.statusError = checkCommonValidation("status", status.name);
    error.smeProductsError = smeProducts.length === 0 ? Constant.ERROR_SME_PRODUCTS : null;
    error.potentialValueError = checkCommonValidation("potentialValue", lead.potentialValue);
    error.leadRemark = lead.leadRemark.length > 750 ? "Error lead remark" : null;

    return isComplete(error);
};

//Admin Create User Validation
const checkAdminCreateUserValidation = (lanId, role, manager, region, team, phone) => {
    let error = {
        regionError: checkCommonValidation("region", region),
        teamError: checkCommonValidation("team", team),
        managerError: checkCommonValidation("manager", manager),
        staffIdError: checkCommonValidation("lanId", lanId),
        userRoleError: checkCommonValidation("role", role.name),
    };
    if (role.roleLevel === 5 || role.roleLevel === 6 || role.roleLevel === 4) {
        error.regionError = null;
        error.teamError = null;
        error.managerError = null;
    }

    if (role.roleLevel === 3) {
        error.teamError = null;
        error.managerError = null;
    }

    if (role.roleLevel === 8) {
        error.managerError = null;
        error.regionError = null;
        error.teamError = null;
    }

    if (phone) {
        error.phoneError = checkCommonValidation("phone", phone);
    }

    return isComplete(error);
};
const checkAdminEditUserValidation = (lanId, phone) => {
    let error = {};
    error.staffIdError = checkCommonValidation("lanId", lanId);
    if (phone) {
        error.phoneError = checkCommonValidation("phone", phone);
    }
    return isComplete(error);
};

const checkFilterUsers = (role, status) => {
    if (status.name === "Inactive") {
        return checkCommonValidation("filterUsers", role.name);
    } else {
        return null;
    }
};

const checkCreateMeetingNotes = (
    purpose,
    status,
    statusReasons,
    reason,
    partiallySubmittedProducts,
    isPartiallySubmitted,
    noteDescription,
) => {
    let error = {};
    error.meetingNotesPurposeError = checkCommonValidation("meetingNotesPurpose", purpose.name);
    error.meetingNotesStatusError = checkCommonValidation("meetingNotesStatus", status.name);
    error.statusReasonsError = statusReasons.length > 0 && !reason.id ? Constant.ERROR_STATUS_REASON : null;
    error.partiallySubmittedProductsError =
        isPartiallySubmitted && partiallySubmittedProducts.length == 0 ? Constant.ERROR_PARTIALLY_SUBMITTED_PRODUCT : null;
    error.noteDescription = noteDescription && noteDescription.length > 1000 ? "Error meeting note description" : null;
    return isComplete(error);
};

const formatMeetingNotesDate = (value) => {
    return moment(value).format("ddd, DD MMM, YYYY - h:mm a");
};

const formatTimeLineData = (value) => {
    return moment(value).format("ddd");
};

const checkStatusPartiallySubmitted = (listStatus, status) => {
    let obj = status;
    if (status.name === Constant.PARTIALLY_SUBMITTED) {
        listStatus.forEach((sta) => {
            if (sta.name === Constant.APPLICATION_SUBMITTED) {
                obj = sta;
            }
        });
    }
    return obj;
};

const checkMeetingNoteAddress = (address) => {
    let error = {};
    error.meetingNotesStreetError = !checkCompanyName(address.meetingNotesStreet) ? Constant.ERROR_STREET_MEETING : null;
    error.meetingNotespostalCodeError = !checkNumeric(address.meetingNotesPostalCode) ? Constant.ERROR_POSTAL_CODE_MEETING : null;
    error.meetingNotesCityError = !checkCompanyName(address.meetingNoteCity) ? Constant.ERROR_CITY_MEETING : null;
    return isComplete(error);
};

const filterLeadByStatusAndColor = (listLead) => {
    let leads = _.sortBy(listLead, (lead) => {
        return new Date(lead.level1StatusUpdatedTime) && lead.colorCode;
    });
    return _.sortBy(leads, (lead) => {
        return lead.read;
    });
};

const checkCommonValidation = (type, value) => {
    switch (type) {
        case "companyName":
            if (!value || !checkCompanyName(value)) return Constant.ERROR_COMPANY_NAME;
            return null;
        case "companyRegNo":
            if (!value || !checkAlphaNumeric(value)) return Constant.ERROR_COMPANY_REG_NO;
            return null;
        case "firstLineAddress":
            if (!value || !checkCompanyName(value)) return Constant.ERROR_FIRST_LINE_ADDRESS;
            return null;
        case "city":
            if (!value || !checkAlphaNumeric(value)) return Constant.ERROR_CITY;
            return null;
        case "state":
            if (!value || !checkAlphaNumeric(value)) return Constant.ERROR_STATE;
            return null;
        case "postalCode":
            if (!value || !checkNumeric(value)) return Constant.ERROR_POSTAL_CODE;
            return null;
        case "contactName":
            if (!value || !checkContactNameAndDirectorName(value)) return Constant.ERROR_CONTACT_NAME;
            return null;
        case "contactNumber":
            if (!value.includes("+60")) return Constant.ERROR_CONTACT_NUMBER_WITH_STATE_CODE;
            return null;

        case "mobileNo":
            if (!value.includes("+60")) return Constant.ERROR_CONTACT_NUMBER_WITH_STATE_CODE;
            return null;
        case "potentialValue":
            if (!value || !checkNumeric(value)) return Constant.ERROR_POTENTIAL_VALUE;
            return null;
        case "category":
            if (!value) return Constant.ERROR_CATEGORY;
            return null;
        case "status":
            if (!value) return Constant.ERROR_STATUS;
            return null;
        case "contactType":
            if (!value) return Constant.ERROR_CONTACT_TYPE;
            return null;
        case "industry":
            if (!value) return Constant.ERROR_INDUSTRY;
            return null;
        case "companyType":
            if (!value) return Constant.ERROR_COMPANY_TYPE;
            return null;
        case "meetingNotesPurpose":
            if (!value) return Constant.ERROR_PURPOSE_MEETING;
            return null;
        case "meetingNotesStatus":
            if (!value) return Constant.ERROR_STATUS_MEETING;
            return null;
        case "supplierDays":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_SUPPLIER_DAYS;
            return null;
        case "receivableDays":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_RECEIVABLE_DAYS;
            return null;
        case "inventoryDays":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_INVENTORY_DAYS;
            return null;
        case "monthlyRevenue":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_MONTHLY_REVENUE;
            return null;
        case "grossProfitMargin":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkDecimal(value)) return Constant.ERROR_GROSS_PROFIT_MARGIN;
            return null;
        case "workingCapitalExisting":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_WORKING_CAPITAL_EXISTING;
            return null;
        case "accountsPayable":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_ACCOUNTS_PAYABLE;
            return null;
        case "payableCost":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_PAYABLE_COST;
            return null;
        case "inventory":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_INVENTORY;
            return null;
        case "inventoryCost":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_INVENTORY_COST;
            return null;
        case "accountsReceivable":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_ACCOUNTS_RECEIVABLE;
            return null;
        case "receivableRevenue":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_RECEIVABLE_REVENUE;
            return null;
        case "totalLimit":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_TOTAL_LIMIT;
            return null;
        case "interestRate":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkDecimal(value)) return Constant.ERROR_INTEREST_RATE;
            return null;
        case "commitmentFee":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkDecimal(value)) return Constant.ERROR_COMMITMENT_FEE;
            return null;
        case "limit":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_LIMIT;
            return null;
        case "transactionAmount-0":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_TRANSACTION_AMOUNT;
            return null;
        case "transactionAmount-1":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_TRANSACTION_AMOUNT;
            return null;
        case "transactionAmount-2":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_TRANSACTION_AMOUNT;
            return null;
        case "transactionAmount-3":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_TRANSACTION_AMOUNT;
            return null;
        case "dayInMonth-1":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_DAY_IN_MONTH;
            if (parseInt(value) > 31) return Constant.ERROR_MONTH_MAX_DAY;
            return null;
        case "dayInMonth-2":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_DAY_IN_MONTH;
            if (parseInt(value) > 31) return Constant.ERROR_MONTH_MAX_DAY;
            return null;
        case "dayInMonth-3":
            if (!value) return Constant.EMPTY_INPUT_FIELD;
            if (!checkNumeric(value)) return Constant.ERROR_DAY_IN_MONTH;
            if (parseInt(value) > 31) return Constant.ERROR_MONTH_MAX_DAY;
            return null;
        case "newWithdrawal-0":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-1":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-2":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-3":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-4":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-5":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-6":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-7":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-8":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-9":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-10":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-11":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "newWithdrawal-12":
            if (!value || !checkNumeric(value)) return Constant.ERROR_NEW_WITHDRAWAL;
            return null;
        case "phone":
            if (!value || !checkNumeric(value)) return Constant.ERROR_PHONE_NUMBER;
            return null;
        case "lanId":
            if (!checkStaffId(value)) return Constant.ERROR_STAFF_ID;
            return null;
        case "role":
            if (!value) return Constant.ERROR_USER_ROLE;
            return null;
        case "manager":
            if (!value) return Constant.ERROR_MANAGER;
            return null;
        case "replacementManager":
            if (!value) return Constant.ERROR_REPLACEMENT_MANAGER;
            return null;
        case "region":
            if (!value) return Constant.ERROR_REGION;
            return null;
        case "team":
            if (!value) return Constant.ERROR_TEAM;
            return null;
        case "statusReasons":
            if (!value) return Constant.ERROR_STATUS_REASON;
            return null;
        case "userName":
            if (!value) return Constant.ERROR_USER_NAME;
            return null;
        case "userEmail":
            if (!value) return Constant.ERROR_USER_EMAIL;
            return null;
        case "filterUsers":
            if (!value || !checkUserRole(value)) return Constant.ERROR_FILTER_USERS;
            return null;
        case "userAssign":
            if (!value) return Constant.ERROR_ASSIGN_USER;
            return null;
        case "productId":
            if (!value) return Constant.ERROR_PRODUCT_ID;
            return null;
        case "productName":
            if (!value) return Constant.ERROR_PRODUCT_NAME;
            return null;
        case "productCategory":
            if (!value) return Constant.ERROR_PRODUCT_CATEGORY;
            return null;
        case "speName":
            if (!value) return Constant.ERROR_PRODUCT_SPECIALIST_NAME;
            return null;
        case "speJobTitle":
            if (!value) return Constant.ERROR_PRODUCT_SPECIALIST_JOB_TITLE;
            return null;
        case "spePhone":
            if (!value || !checkNumeric(value)) return Constant.ERROR_PRODUCT_SPECIALIST_PHONE;
            return null;
        case "speEmail":
            if (!value || !checkEmail(value)) return Constant.ERROR_PRODUCT_SPECIALIST_EMAIL;
            return null;
        case "meetingNotesStreet":
            if (!value || !checkCompanyName(value)) return Constant.ERROR_STREET_MEETING;
            return null;
        case "meetingNotesPostalCode":
            if (!value || !checkNumeric(value)) return Constant.ERROR_POSTAL_CODE_MEETING;
            return null;
        case "meetingNoteCity":
            if (!value || !checkCompanyName(value)) return Constant.ERROR_CITY_MEETING;
            return null;
        default:
            return null;
    }
};

export default {
    isComplete,
    checkStaffId,
    checkCodeColor,
    checkErrorServer,
    checkAlphaNumeric,
    formatTimeLineData,
    checkStatusDropdown,
    checkDuplicateContact,
    checkCommonValidation,
    checkDuplicateDirector,
    formatMeetingNotesDate,
    checkCreateMeetingNotes,
    checkDirectorValidation,
    checkOverrideFileUpload,
    checkOverrideFileUpload_v1,
    checkCreateLeadValidation,
    filterLeadByStatusAndColor,
    checkAddOfContactValidation,
    checkStatusPartiallySubmitted,
    checkCreateCustomerValidation,
    checkPointOfContact,
    checkAdminCreateUserValidation,
    checkFilterUsers,
    checkShowNotification,
    checkAdminDetailProduct,
    checkAdminEditUserValidation,
    checkBankerTimelineValidation,
    checkByDaysValidation,
    checkByBalanceSheetValidation,
    checkOverdraftValidation,
    checkAdminCreateProduct,
    checkAdminPublishProduct,
    checkMeetingNoteAddress,
    checkEmail,
    checkUpdateLeadValidation_s1,
    checkContactSpecialistProduct,
    checkAdminCreateProductDescription,
    checkProductDisclaimer,
};
