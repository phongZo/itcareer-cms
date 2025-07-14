import { apiUrl, apiTenantUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

const apiConfig = {
    account: {
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        loginBasic: {
            baseURL: `${apiUrl}api/token`,
            method: 'POST',
            headers: baseHeader,
        },
        loginSSO: {
            baseURL: `${apiUrl}v1/account/login-sso`,
            method: 'POST',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/account/update_profile_admin`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'ACC_U_PROFILE_AD',
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ACC_V',
        },
        refreshToken: {
            baseURL: `${apiUrl}v1/account/refresh_token`,
            method: 'POST',
            headers: baseHeader,
        },
        logout: {
            baseURL: `${apiUrl}v1/account/logout`,
            method: 'GET',
            headers: baseHeader,
        },
        changePassword: {
            baseURL: `${apiTenantUrl}v1/account/change-password`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getList: {
            baseURL: `${apiUrl}v1/account/list-admin`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'ACC_L',
        },
        updateAdmin: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'ACC_U_AD',
        },
        delete: {
            baseURL: `${apiUrl}v1/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            permissionCode: 'ACC_D',
        },
        createAdmin: {
            baseURL: `${apiUrl}v1/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'ACC_C_AD',
        },
    },
    user: {
        getList: {
            baseURL: `${apiUrl}v1/account/list`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'ACC_L',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/account/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'ACC_V',
        },
        create: {
            baseURL: `${apiUrl}v1/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'ACC_C_AD',
        },
        update: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'ACC_U_AD',
        },
        delete: {
            baseURL: `${apiUrl}v1/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            permissionCode: 'ACC_D',
        },
    },
    file: {
        upload: {
            path: `${apiUrl}v1/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
            isRequiredTenantId: true,
            isUpload: true,
            permissionCode: 'FILE_U',
        },
    },
    post: {
        getList: {
            baseURL: `${apiUrl}api/posts/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}api/posts/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}api/posts/create`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}api/posts/update`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}api/posts/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}api/posts/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
    },
    category: {
        getListForBrand: {
            baseURL: `${apiUrl}v1/category/list?kind=2`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_L',
        },
        getList: {
            baseURL: `${apiUrl}v1/category/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/category/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_V',
        },
        create: {
            baseURL: `${apiUrl}v1/category/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_C',
        },
        update: {
            baseURL: `${apiUrl}v1/category/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/category/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'CATE_D',
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/category/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    groupPermission: {
        getGroupList: {
            baseURL: `${apiUrl}v1/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getList: {
            baseURL: `${apiUrl}v1/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getPemissionList: {
            baseURL: `${apiUrl}v1/permission/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'PER_L',
        },
        getPemissionListByApp: {
            baseURL: `${apiUrl}v1/project-role-permission/list-by-app`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'PRP_L_A',
        },
        getById: {
            baseURL: `${apiUrl}v1/group/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_V',
        },
        create: {
            baseURL: `${apiUrl}v1/group/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'GR_C',
        },
        update: {
            baseURL: `${apiUrl}v1/group/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'GR_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/group/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'GR_D',
        },
        getGroupListCombobox: {
            baseURL: `${apiUrl}v1/group/list_combobox`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    news: {
        getList: {
            baseURL: `${apiTenantUrl}v1/news/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/news/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/news/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'NEW_C',
        },
        update: {
            baseURL: `${apiTenantUrl}v1/news/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'NEW_U',
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/news/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'NEW_D',
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/news/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    settings: {
        getList: {
            baseURL: `${apiTenantUrl}v1/setting/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'SET_L',
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/setting/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'SET_V',
        },
        create: {
            baseURL: `${apiTenantUrl}v1/setting/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'SET_C',
        },
        update: {
            baseURL: `${apiTenantUrl}v1/setting/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'SET_U',
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/setting/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
            permissionCode: 'SET_D',
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/setting/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        settings: {
            baseURL: `${apiTenantUrl}v1/setting/settings`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    nation: {
        getList: {
            baseURL: `${apiUrl}v1/nation/list`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'NAT_L',
        },
        getById: {
            baseURL: `${apiUrl}v1/nation/get/:id`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'NAT_V',
        },
        autoComplete: {
            baseURL: `${apiUrl}v1/nation/auto-complete`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'NAT_L',
        },
        create: {
            baseURL: `${apiUrl}v1/nation/create`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'NAT_C',
        },
        update: {
            baseURL: `${apiUrl}v1/nation/update`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'NAT_U',
        },
        delete: {
            baseURL: `${apiUrl}v1/nation/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            permissionCode: 'NAT_D',
        },
        getClientList: {
            baseURL: `${apiUrl}v1/nation/client-list`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'NAT_L',
        },
        getClientById: {
            baseURL: `${apiUrl}v1/nation/client-get/:id`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'NAT_V',
        },
    },
};

export default apiConfig;
