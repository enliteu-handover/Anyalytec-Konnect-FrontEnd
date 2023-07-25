import { getRoles, initializeIDM, validateAuthorization } from '@crayond_dev/idm-client';
export const idmRoleMapping = async (role, permission = ['update', 'read', 'create', 'delete']) => {
    debugger;
    const roles = await getRoles({});
    const finfRole = roles.find(v => v.name === role)
    const isIDMInitialized = await initializeIDM({ roleId: finfRole?.id });
    const GetPermissions = JSON.parse(localStorage.getItem('permissions'));
    var validate = null;
    if (isIDMInitialized) {
        validate = validateAuthorization(getIds(GetPermissions), permission);
    }

    return getPermission(GetPermissions, validate)
    // return validate;
}


const getIds = (GetPermissions) => {
    let array = [];
    const chilMapped = (data) => {
        return data?.map(v => {
            array.push(v?.id)
            chilMapped(v?.child)
        })
    }
    chilMapped(GetPermissions ?? []);
    return array;
}

const getPermission = (GetPermissions, validate) => {
    let array = {};
    const chilMapped = (data) => {
        return data?.map(v => {
            const firstLetterLowercase = v?.name?.charAt(0).toLowerCase() + v?.name?.slice(1);
            const result = firstLetterLowercase?.replace(/\s/g, '');
            array[result] = validate[v?.id]['read']
            chilMapped(v?.child)
        })
    }
    chilMapped(GetPermissions ?? [])
    return array;
}