import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import DepartmentListPage from '@modules/department';
import DepartmentEmployeeListPage from '@modules/department/departmentEmployee';
import DepartmentSavePage from '@modules/department/DepartmentSavePage';

const paths = {
    departmentListPage: '/departments',
    departmentSavePage: '/departments/:id',
    departmentEmployeeListPage: '/department/:id/employees',
};

export default {
    departmentListPage: {
        path: paths.departmentListPage,
        auth: true,
        component: DepartmentListPage,
        permissions: [apiConfig.department.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.department,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.department) }];
            },
        },
    },
    departmentSavePage: {
        path: paths.departmentSavePage,
        component: DepartmentSavePage,
        permissions: [apiConfig.department.create.permissionCode, apiConfig.department.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.department,
            listPageUrl: paths.departmentListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.department), path: paths.departmentListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    departmentEmployeeListPage: {
        path: paths.departmentEmployeeListPage,
        component: DepartmentEmployeeListPage,
        permissions: [apiConfig.department.create.permissionCode, apiConfig.department.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.department,
            listPageUrl: paths.departmentListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.department), path: paths.departmentListPage },
                    { breadcrumbName: t.formatMessage(messages.employee) },
                ];
            },
        },
    },
};
