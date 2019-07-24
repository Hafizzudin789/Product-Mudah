import _ from "lodash";
import $ from "jquery";
import JSZip from "jszip";
import moment from "moment";
import Constant from "../constant";
import FileSaver from "file-saver";
import store from "./../main";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const zipFile = (file, type, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const zip = new JSZip();
    zip.file(file.name, file);
    zip.generateAsync({ type: "base64" }).then(function(content) {
        callback(content, type);
    });
    reader.onerror = function() {};
};

const showPerformanceChart = (roleName, metricName) => {
    let permissionName = metricName.toLowerCase().trim();
    switch (roleName.toUpperCase().trim()) {
        case "CBBC RM":
            return ["asset growth", "deposit growth", "sales (mm+plm)", "sales (abf)", "ca growth"].indexOf(permissionName) > -1
                ? true
                : false;
        case "ABF RM":
            return ["sales (mm+plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "SR. ABF RM":
        case "SR ABF RM":
            return ["asset growth", "sales (mm+plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "BDM PLM":
            return ["deposit growth", "sales (plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "MOBILE BDM":
        case "MOBILE BDM PLM":
            return ["sales (plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "CBBC HEAD":
            return ["asset growth", "deposit growth", "sales (mm+plm)", "sales (abf)", "ca growth"].indexOf(permissionName) > -1
                ? true
                : false;
        case "MOBILE TEAM LEADER":
        case "MOBILE BDM TEAM LEADER":
            return ["sales (plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "BDM HEAD":
            return ["deposit growth", "sales (plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        case "REGIONAL SME HEAD":
            return ["asset growth", "deposit growth", "ca growth"].indexOf(permissionName) > -1 ? true : false;
        case "MOBILE HEAD":
            return ["sales (plm)", "sales (abf)"].indexOf(permissionName) > -1 ? true : false;
        default:
            return false;
    }
};

const downLoadErrorLog = (content) => {
    let blob = b64toBlob(content, { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "error_log.txt");
};

const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

const permissionUpload = (name, permissions) => {
    let flag = false;
    (permissions || []).forEach((per) => {
        if (per.name === name) {
            flag = true;
        }
    });
    return flag;
};

const checkPermissionChange = (permissions, originalPermissions) => {
    let object = [];
    permissions.forEach((group) => {
        group.permissions.forEach((per) => {
            originalPermissions.forEach((oriPer) => {
                if (per.id === oriPer.id && per.selected !== oriPer.selected) {
                    object.push(oriPer);
                }
            });
        });
    });
    return object;
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const sortLeadByStatus = (listData, value) => {
    if (!value) value = "generated";
    $(".team-accordion__collapse.leads-collapse.collapse").removeClass("show");
    return _.sortBy(listData, [value.toLowerCase()]);
};

const formatDataLeadSummary = (data) => {
    return {
        stats: [
            { status: "generated", count: data.generated, unAssignedCount: data.genUnAssignedCount, overDueCount: data.genOverDueCount },
            { status: "submitted", count: data.submitted, overDueCount: data.contOverDueCount },
            { status: "approved", count: data.approved },
            { status: "accepted", count: data.accepted },
        ],
    };
};

const formatDataUserSummary = (listUsers) => {
    listUsers.forEach((user) => {
        if (!user.generated) user.generated = 0;
        if (!user.contacted) user.contacted = 0;
        if (!user.submitted) user.submitted = 0;
        if (!user.converted) user.converted = 0;
        user.stats = [
            { status: "Generated", count: user.generated, unAssignedCount: user.genUnAssignedCount, overDueCount: user.genOverDueCount },
            { status: "Contacted", count: user.contacted, overDueCount: user.contOverDueCount },
            { status: "Submitted", count: user.submitted },
            { status: "Converted", count: user.converted },
        ];
    });
    return listUsers;
};

const checkXLSX = (name, type) => {
    if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && name.indexOf(".xlsx") !== -1) {
        return true;
    }
    return false;
};

const checkPDF = (name, type) => {
    if (type === "application/pdf" && name.indexOf(".pdf") !== -1) {
        return true;
    }
    return false;
};

const checkSupportDocFormat = (nameFile, type) => {
    const name = nameFile ? nameFile.toLowerCase() : "";
    if (type === "application/pdf" && name.indexOf(".pdf") !== -1) {
        return true;
    } else if (type === "application/msword" && name.indexOf(".doc") !== -1) {
        return true;
    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && name.indexOf(".docx") !== -1) {
        return true;
    } else if (["image/jpeg", "image/jpg", "image/png", "image/gif"].indexOf(type) > -1) {
        return true;
    } else {
        return false;
    }
};

const checkSize = (filesize, optionalSize = false) => {
    return optionalSize ? filesize <= optionalSize : filesize <= 3145728;
};

const formatDataMetrics = (listData, roleId, getFirst) => {
    let object = [];
    let listMetrics = [];
    listData.forEach((data) => {
        if (data.roleId === roleId) {
            object = data.metrics;
        }
    });
    object.forEach((data) => {
        let item = {};
        item.name = data;
        listMetrics.push(item);
    });
    if (getFirst) {
        return listMetrics[0];
    }
    return listMetrics;
};

const downloadFile = (content, fileName, fileType = ".xlsx") => {
    let blob = b64toBlob(content, { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, fileName + fileType);
};

const getMonths = () => {
    const months = moment.monthsShort();
    let object = [];
    months.forEach((mth) => {
        object.push({ name: mth });
    });
    return object;
};

const getWeeks = () => {
    return [{ name: "Week 1" }, { name: "Week 2" }, { name: "Week 3" }, { name: "Week 4" }];
};

const getYear = () => {
    return [{ name: moment().format("YYYY") }];
};

const getMTPYTP = () => {
    return [{ name: "MTD" }, { name: "YTD" }];
};
const getFileTypes = () => {
    return [{ name: "Actual" }, { name: "Budget" }];
};

const getHealthCheckType = () => {
    return [{ name: "Check Now", type: "check" }, { name: "Check with Financial Input", type: "calculate" }];
};

const formatMTDCommission = (listData) => {
    let object = [];
    const commission = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in commission) {
        let data = {};
        data.name = key;
        if (commission.hasOwnProperty(key)) {
            commission[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return object;
};

const formatPerformanceSummary = (listData) => {
    let object = [];
    const performances = _.groupBy(listData ? listData.metricDetails : [], "name");
    for (const key in performances) {
        let data = {};
        data.name = key;
        if (data.name.trim().toLowerCase() === "kpi score") {
            data.total = 5;
        }
        if (performances.hasOwnProperty(key)) {
            performances[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return _.orderBy(object, ["name"], ["asc"]);
};

const formatMTDPerformance = (listData) => {
    let object = [];
    const performances = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in performances) {
        let data = {
            total: 5,
        };
        data.name = key;
        if (performances.hasOwnProperty(key)) {
            performances[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return object;
};

const formatRankingIndividual = (team, region) => {
    let object = [];
    team.isTeam = true;
    region.isRegion = true;
    object.push(team);
    object.push(region);
    object.push({ name: Constant.MALAYSIA, isMalaysia: true });
    return object;
};

const formatRankingRegion = (region) => {
    let object = [];
    region.isRegion = true;
    object.push(region);
    object.push({ name: Constant.MALAYSIA, isMalaysia: true });
    return object;
};

const formatMTDProductivity = (listData) => {
    let object = [];
    const productivities = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in productivities) {
        let data = {};
        data.name = key;
        if (productivities.hasOwnProperty(key)) {
            productivities[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return object;
};

const formatMTDCrossSell = (listData) => {
    let object = [];
    const crossSell = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in crossSell) {
        let data = {};
        data.name = key;
        if (crossSell.hasOwnProperty(key)) {
            crossSell[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return object;
};

const formatMTDFinancialKPT = (listData) => {
    let object = [];
    const financialKPT = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in financialKPT) {
        let data = {};
        data.name = key;
        if (financialKPT.hasOwnProperty(key)) {
            financialKPT[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return sortByPatternRole(object);
};

const formatMTDAssetQuality = (listData) => {
    let object = [];
    const assetQuality = _.groupBy(listData ? listData.metricInfo : [], "name");
    for (const key in assetQuality) {
        let data = {};
        data.name = key;
        if (assetQuality.hasOwnProperty(key)) {
            assetQuality[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Date") {
                    data.date = "as of " + moment(per.value).format("D MMM");
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    return object;
};

const formatTeamList = (listData) => {
    let object = [];
    const commission = _.groupBy(listData ? listData : [], "name");
    for (const key in commission) {
        let data = {};
        data.name = key;
        if (commission.hasOwnProperty(key)) {
            commission[key].forEach((per) => {
                if (per.type === "Actual") {
                    data.number = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Achievement") {
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
                if (per.type === "Budget") {
                    data.total = per.value;
                    if (per.colorCode) data.color = per.colorCode.colorCode;
                }
            });
        }
        object.push(data);
    }
    if (object.length === 0) object.push({ number: 0, total: 0 });
    return object;
};

const PMT = (rate_per_period, number_of_payments, present_value, future_value, type) => {
    if (rate_per_period != 0.0) {
        // Interest rate exists
        var q = Math.pow(1 + rate_per_period, number_of_payments);
        return -(rate_per_period * (future_value + q * present_value)) / ((-1 + q) * (1 + rate_per_period * type));
    } else if (number_of_payments != 0.0) {
        // No interest rate, but number of payments exists
        return -(future_value + present_value) / number_of_payments;
    }

    return 0;
};

const formatProductsListing = (products) => {
    let object = [];
    //TODO: Improve me
    products = _.uniqBy(products, function(e) {
        return e.productId;
    });
    products = _.sortBy(products, function(e) {
        return e.productName;
    });
    object = _.groupBy(products, (prod) => {
        return prod.productCategories && prod.productCategories[0].code;
    });
    return object;
};

const stringInject = (str, data) => {
    if (typeof str === "string" && data instanceof Array) {
        return str.replace(/({\d})/g, (i) => {
            return data[parseInt(i.replace(/{/, "").replace(/}/, "")) - 1];
        });
    } else if (typeof str === "string" && data instanceof Object) {
        for (let key in data) {
            return str.replace(/({([^}]+)})/g, (i) => {
                let key = i.replace(/{/, "").replace(/}/, "");
                if (!data[key]) {
                    return i;
                }
                return data[key];
            });
        }
    } else {
        return false;
    }
};

const sortByPatternRole = (list) => {
    const pattern = {
        "sales (mm+plm)": 1,
        "sales (plm)": 2,
        "sales (abf)": 3,
        "asset growth": 4,
        "deposit growth": 5,
        "ca growth": 6,
        "abf new customer": 7,
    };
    return list.sort((x, y) => {
        return pattern[x.name.toLowerCase()] - pattern[y.name.toLowerCase()];
    });
};

const readFileBase64 = (file, callback) => {
    if (file) {
        let reader = new FileReader();
        reader.onload = function(readerEvt) {
            let binaryString = readerEvt.target.result;
            callback(btoa(binaryString));
        };
        reader.readAsBinaryString(file);
    }
};

const checkAlphaNumeric = (value) => {
    const regexAlphaNumeric = /^[a-z0-9\s]+$/i;
    return regexAlphaNumeric.test(value);
};

const checkNumeric = (charCode) => {
    return !/^[0-9.-]+$/.test(String.fromCharCode(charCode));
};

const convertDataTable = (list, defaultTable, nameId) => {
    let result = [];
    (list || []).map((entry) => {
        let row = [];
        let defaultCols = { ...defaultTable };
        defaultCols.id = entry[nameId];
        (defaultTable.row || []).map((i) => {
            let col = { ...i };
            col.value = getValueJson(entry, col.refName);
            row.push(col);
        });
        defaultCols.row = row;
        result.push(defaultCols);
    });
    return result;
};

const getValueJson = (jsonObj, list) => {
    let result = jsonObj;
    try {
        if (list.length == 0) {
            return "";
        }
        (list || []).map((entry) => {
            result = result[entry];
        });
        return result;
    } catch (error) {
        return "";
    }
};

const parseMeetingScheduleDate = (date) => {
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
    }

    var dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let txt = `${dayName[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${formatAMPM(date)}`;

    return txt;
};

const parseMeetingScheduleDateForBackend = (date) => {
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + ":00" + " " + ampm;
        return strTime;
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let txt = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${formatAMPM(date)}`;

    return txt;
};

// need this function to avoid circular json stringify
function simpleStringify(object) {
    if (object && typeof object === "object") {
        object = copyWithoutCircularReferences([object], object);
    }
    return JSON.stringify(object);

    function copyWithoutCircularReferences(references, object) {
        var cleanObject = {};
        Object.keys(object).forEach(function(key) {
            var value = object[key];
            if (value && typeof value === "object") {
                if (references.indexOf(value) < 0) {
                    references.push(value);
                    cleanObject[key] = copyWithoutCircularReferences(references, value);
                    references.pop();
                } else {
                    cleanObject[key] = "###_Circular_###";
                }
            } else if (typeof value !== "function") {
                cleanObject[key] = value;
            }
        });
        return cleanObject;
    }
}

const empty = (data) => {
    if (typeof data == "number" || typeof data == "boolean") {
        return false;
    }
    if (typeof data == "undefined" || data === null) {
        return true;
    }
    if (typeof data.length != "undefined") {
        return data.length == 0;
    }
    var count = 0;
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            count++;
        }
    }
    return count == 0;
};

const is_numeric = (str) => {
    return /^\d+$/.test(str);
};

const trimLower = (str) => {
    return str
        .trim()
        .toLowerCase()
        .replace(/ /g, "");
};

const deepFind = (obj, path) => {
    var paths = path.split("."),
        current = obj,
        i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
};

export const dispatch = (func) => {
    store && store.dispatch(func);
};

export const getUserRole = () => {
    const user = store.getState().login.user;
    return user && user.role ? user.role : {};
};

export const isAccessLevel = (accessLevel) => {
    const role = getUserRole();
    if (!role || !role.accessLevel) {
        return false;
    }
    return role.accessLevel === accessLevel;
};

export const getUserPermissions = () => {
    const { user } = store.getState().login;
    return user && user.permissions ? user.permissions : null;
};

function formatBytes(bytes, decimals = 2) {
    let counter = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        counter++;
    }
    // special case to force minimum unit to be KB
    if (counter === 0) {
        bytes /= 1024;
        counter++;
    }
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const formated = `${bytes.toFixed(decimals ? decimals : 2)} ${sizes[counter]}`;

    return formated;
}

function getResponseMsg(res) {
    return _.get(res, "body.response.status.message", "Oops Something Went Wrong");
}

const formatCurrencyValue = (value) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1).toString()}M`;
    }

    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

/**
 * converts a list of HTMLElements into array of canvases
 * @param printableAreas array of HTMLElements ids
 */
const convertHTML2Canvases = async (printableAreas) => {
    const canvases = [];
    for (const printableArea of printableAreas) {
        const content = document.getElementById(printableArea);
        if (content) {
            const canvas = await html2canvas(content);
            canvases.push(canvas);
        }
    }

    return canvases;
};

/**
 * converts canvases into a single PDF file
 * @param canvases array of HTMLCanvasElements
 * @returns {File}
 */
const convertCanvas2PDF = (canvases) => {
    let pdf = new jsPDF("p", "mm");
    let firstPage = true;
    const PAGE_CONTENT_SPACING = 5; // 2 CM (centimeter)
    for (const canvas of canvases) {
        if (firstPage) {
            firstPage = false;
        } else {
            pdf.addPage();
        }
        let imgData = canvas.toDataURL({ format: "jpeg", quality: 0.2 });
        let imgWidth = 210;
        let pageHeight = 297 - PAGE_CONTENT_SPACING;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
        // Fill 2 CM with white space - start
        pdf.setDrawColor(255);
        pdf.setFillColor(255);
        pdf.rect(0, pageHeight, imgWidth, PAGE_CONTENT_SPACING, "F");
        // Fill 2 CM with white space - end
        heightLeft -= pageHeight - PAGE_CONTENT_SPACING;
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
            // Fill 2 CM with white space - start
            pdf.setDrawColor(255);
            pdf.setFillColor(255);
            pdf.rect(0, 0, imgWidth, PAGE_CONTENT_SPACING, "F");
            pdf.rect(0, pageHeight, imgWidth, PAGE_CONTENT_SPACING, "F");
            // Fill 2 CM with white space - end
            pageHeight = 297 - PAGE_CONTENT_SPACING * 2;
            heightLeft -= pageHeight;
        }
    }
    let file = pdf.output("blob");
    return ["application/pdf"].indexOf(file.type) > -1 ? file : null;
};

/**
 * converts a list of HTMLElements into a single PDF file
 * @param printableAreas array of HTMLElements ids
 */
const convertHTML2PDF = async (printableAreas) => {
    const canvases = await convertHTML2Canvases(printableAreas);

    return convertCanvas2PDF(canvases);
};

/**
 * opens a pdf file in a new tab and order print
 * @param file PDF File in binary format
 */
const openAndPrintPDF = (file) => {
    const fileURL = URL.createObjectURL(file);
    const embed = `<embed width='100%' height='100%' src='${fileURL}' type='application/pdf'></embed>`;
    window.open("").document.write(embed);
};

/**
 * convert BASE64 into Binary format
 * @param fileBase64 any file in base64 format
 */
const convertBase64IntoFile = async (base64) => {
    try {
        const url = `data:application/pdf;base64,${encodeURI(base64)}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "File name");
        return file;
    } catch (error) {
        return null;
    }
};

export default {
    PMT,
    trimLower,
    zipFile,
    getYear,
    checkPDF,
    getWeeks,
    b64toBlob,
    checkSize,
    checkXLSX,
    getMonths,
    getMTPYTP,
    downloadFile,
    formatTeamList,
    permissionUpload,
    sortLeadByStatus,
    downLoadErrorLog,
    formatDataMetrics,
    formatMTDCrossSell,
    formatMTDCommission,
    formatRankingRegion,
    showPerformanceChart,
    formatMTDPerformance,
    formatDataLeadSummary,
    checkPermissionChange,
    formatDataUserSummary,
    formatMTDAssetQuality,
    formatMTDFinancialKPT,
    formatMTDProductivity,
    capitalizeFirstLetter,
    formatProductsListing,
    checkSupportDocFormat,
    formatRankingIndividual,
    formatPerformanceSummary,
    stringInject,
    sortByPatternRole,
    readFileBase64,
    checkNumeric,
    checkAlphaNumeric,
    convertDataTable,
    parseMeetingScheduleDate,
    parseMeetingScheduleDateForBackend,
    simpleStringify,
    empty,
    is_numeric,
    getFileTypes,
    deepFind,
    dispatch,
    getUserRole,
    getHealthCheckType,
    formatBytes,
    getResponseMsg,
    formatCurrencyValue,
    convertHTML2Canvases,
    convertCanvas2PDF,
    convertHTML2PDF,
    openAndPrintPDF,
    convertBase64IntoFile,
};
