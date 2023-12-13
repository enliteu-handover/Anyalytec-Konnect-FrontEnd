import * as XLSX from 'xlsx';
import { URL_CONFIG } from './constants/rest-config';
import { httpHandler } from './http/http-interceptor';
import { idmRoleMapping } from './idm';
import { sharedDataActions } from './store/shared-data-slice';

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
export const downloadXlsx = (name, data) => {
    const worksheet = XLSX.utils.json_to_sheet(data ?? []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name);
};

export const pageLoaderHandler = (arg) => {
    const element = document.getElementById('page-loader-container');
    if (element?.classList) {
        element.classList.remove('d-none', 'd-block');

        if (arg === 'show') {
            element.classList.add('d-block');
        } else {
            element.classList.add('d-none');
        }
    }
}


export const fetchUserPermissions = async (dispatch) => {

    const obj = {
        url: URL_CONFIG.USER_PERMISSION,
        method: "get",
    };
    await httpHandler(obj).then(async (response) => {
        const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);

        const getAndUpdate = sessionStorage.getItem('userData')
        const addFileds = {
            ...JSON.parse(getAndUpdate),
            firstName: response?.data?.firstName,
            lastName: response?.data?.lastName,
            allPoints: response?.data?.totalPoints,
            HeaderLogo: response?.data?.HeaderLogo,
            userLogo: response?.data?.userLogo,
            theme: response?.data?.theme?.[0] ?? {},
        }
        sessionStorage.setItem('userData', JSON.stringify(addFileds))
        await dispatch(sharedDataActions.getUserRolePermission({
            userRolePermission: roleData?.data
        }));

    }).catch((error) => {
        console.log("fetchPermission error", error);
    });
}