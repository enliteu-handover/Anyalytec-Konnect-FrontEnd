import { getRoles, initializeIDM, validateAuthorization } from '@crayond_dev/idm-client';
export const idmRoleMapping = async (role, permission = ['update', 'read', 'create', 'delete']) => {
    const roles = await getRoles({});
    const finfRole = roles.find(v => v.name?.toLowerCase() === role?.toLowerCase())
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
    const chilMapped = (data, name) => {
        return data?.map(v => {
            var nm = v?.name
            if (name?.toLowerCase() === 'awards') {
                var nm = 'award ' + v?.name
            } else if (name?.toLowerCase() === 'badges') {
                var nm = 'badge ' + v?.name
            } else if (name?.toLowerCase() === 'certificates') {
                var nm = 'certificate ' + v?.name
            } else if (name?.toLowerCase() === 'polls') {
                var nm = 'poll ' + v?.name
            } else if (name?.toLowerCase() === 'program') {
                var nm = 'program ' + v?.name
            } else if (name?.toLowerCase() === 'e cards') {
                var nm = 'ecard ' + v?.name
            } else if (name?.toLowerCase() === 'enlite wall') {
                var nm = 'enlite Wall ' + v?.name
            } else if (name?.toLowerCase() === 'survey') {
                var nm = 'survey ' + v?.name
            } else if (name?.toLowerCase() === 'forum') {
                var nm = 'forum ' + v?.name
            }else if (name?.toLowerCase() === 'ideas') {
                var nm = 'ideabox ' + v?.name
            }
            const transformedSentence = transformSentence(nm);
            array[transformedSentence] = validate[v?.id]['read']
            chilMapped(v?.child, v?.name)
        })
    }
    chilMapped(GetPermissions ?? [])
    return array;
};

function transformSentence(sentence) {
    const words = sentence.split(' ');
    const formattedWords = words.map((word, index) => {
        if (index === 0) {
            return word.charAt(0).toLowerCase() + word.slice(1);
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    });
    return formattedWords.join('');
}
