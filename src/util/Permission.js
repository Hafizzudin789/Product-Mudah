const permissionLevel = (level) => {
    const permissionDefault = {
        isCreateLead: true,
        isEditLead: true,
        isCreateMeetingNote: true,
        isEditMeetingNote: true,
        isCreateCustomer: true,
        isEditCustomer: true,
    };

    const permissionRoleLevel1 = {
        isCreateLead: true,
        isEditLead: true,
        isCreateMeetingNote: true,
        isEditMeetingNote: true,
        isCreateCustomer: true,
        isEditCustomer: true,
    };

    const permissionRoleLevel2 = {
        isCreateLead: true,
        isEditLead: false,
        isCreateMeetingNote: false,
        isEditMeetingNote: false,
        isCreateCustomer: true,
        isEditCustomer: true,
    };

    const permissionRoleLevel3 = {
        isCreateLead: true,
        isEditLead: false,
        isCreateMeetingNote: false,
        isEditMeetingNote: false,
        isCreateCustomer: true,
        isEditCustomer: true,
    };

    const permissionRoleLevel4 = {
        isCreateLead: false,
        isEditLead: false,
        isCreateMeetingNote: false,
        isEditMeetingNote: false,
        isCreateCustomer: false,
        isEditCustomer: false,
    };

    let permissions = {};

    switch (level) {
        case 1:
            permissions = permissionRoleLevel1;
            break;
        case 2:
            permissions = permissionRoleLevel2;
            break;
        case 3:
            permissions = permissionRoleLevel3;
            break;
        case 4:
            permissions = permissionRoleLevel4;
            break;
        default:
            permissions = permissionDefault;
            break;
    }
    return permissions;
};

export default {
    permissionLevel,
};
