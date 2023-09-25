export const base64ToFile = (base64Data) => {

    const binaryString = atob(base64Data);
    const byteNumbers = new Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const file = new File([blob], 'filename.png', { type: 'image/png' });

    return file;
};

export const sideMenuHidden = (data, userRolePermission) => {
    debugger
    let arr = data ?? [];

    if (!userRolePermission?.orgChart) {
        const i = arr?.findIndex(v => v.org)
        delete arr[i]
    } if (!userRolePermission?.surveyCreate && !userRolePermission?.surveyModify) {
        const parentI = arr?.findIndex(v => v.communication);
        const parent = arr?.find(v => v.communication);
        const i = parent.subMenu.filter(v => !v.survey)
        parent.subMenu = i
        arr[parentI] = parent
    }; if (!userRolePermission?.forumHide) {
        const parentI = arr?.findIndex(v => v.communication);
        const parent = arr?.find(v => v.communication);
        const i = parent.subMenu.filter(v => !v.forum)
        parent.subMenu = i
        arr[parentI] = parent
    }; if (!userRolePermission?.pollCreate && !userRolePermission?.pollModify) {
        const parentI = arr?.findIndex(v => v.communication);
        const parent = arr?.find(v => v.communication);
        const i = parent.subMenu.filter(v => !v.polls)
        parent.subMenu = i
        arr[parentI] = parent
    }; if (!userRolePermission?.ideaboxHide) {
        const parentI = arr?.findIndex(v => v.communication);
        const parent = arr?.find(v => v.communication);
        const i = parent.subMenu.filter(v => !v.ideabox)
        parent.subMenu = i
        arr[parentI] = parent
    } if (!userRolePermission?.surveyCreate && !userRolePermission?.surveyModify &&
        !userRolePermission?.forumHide && !userRolePermission?.pollCreate && !userRolePermission?.pollModify &&
        !userRolePermission?.ideaboxHide) {
        const i = arr?.findIndex(v => v.communication)
        delete arr[i]
    }; if (!userRolePermission?.awardCreate && !userRolePermission?.certificateCreate &&
        !userRolePermission?.badgeCreate) {
        const i = arr?.findIndex(v => v.library)
        delete arr[i]
    }
    //  if (!userRolePermission?.awardCreate && !userRolePermission?.certificateCreate &&
    //     !userRolePermission?.badgeCreate) {
    //     const parentI = arr.findIndex(v => v.recognition);
    //     const parent = arr.find(v => v.recognition);
    //     const i = parent.subMenu.filter(v => !v.library)
    //     parent.subMenu = i
    //     arr[parentI] = parent
    // };

    return arr;

};