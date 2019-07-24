export default function breadCrum(RoleLevel, drilLevel, oldPage, newPage) {
    const navDetails = {
        current_page: "",
        previous_page: "",
    };
    let updateDetails;
    switch (RoleLevel) {
        case 4:
            updateDetails = lvl4(navDetails, drilLevel, oldPage, newPage);
            break;
        case 3:
            updateDetails = lvl3(navDetails, drilLevel, oldPage, newPage);
            break;
        case 2:
            updateDetails = lvl2(navDetails, drilLevel, newPage);
            break;
        case 1:
            updateDetails = lvl1(navDetails);
            break;
    }
    return updateDetails;
}
function lvl4(navDetails, drilLevel, oldPage, newPage) {
    if (drilLevel === 3) {
        navDetails.previous_page = "Lead";
        navDetails.current_page = newPage; //Region name
        return navDetails;
    } else if (drilLevel === 2) {
        navDetails.previous_page = oldPage; //Region name
        navDetails.current_page = newPage; // Team name
        return navDetails;
    } else if (drilLevel === 1) {
        navDetails.previous_page = oldPage; //Team name
        navDetails.current_page = newPage; // User name
        return navDetails;
    } else {
        navDetails.previous_page = "";
        navDetails.current_page = "Lead";
        return navDetails;
    }
}
function lvl3(navDetails, drilLevel, oldPage, newPage) {
    if (drilLevel === 2) {
        navDetails.previous_page = "Lead";
        navDetails.current_page = newPage; //Team name
        return navDetails;
    } else if (drilLevel === 1) {
        navDetails.previous_page = oldPage; //Team name
        navDetails.current_page = newPage; // User name
        return navDetails;
    } else {
        navDetails.previous_page = "";
        navDetails.current_page = "Lead";
        return navDetails;
    }
}
function lvl2(navDetails, drilLevel, newPage) {
    if (drilLevel === 1) {
        navDetails.previous_page = "Lead";
        navDetails.current_page = newPage; //User name
        return navDetails;
    } else {
        navDetails.previous_page = "";
        navDetails.current_page = "Lead";
        return navDetails;
    }
}
function lvl1(navDetails) {
    navDetails.previous_page = null;
    navDetails.current_page = "Lead";
    return navDetails;
}
