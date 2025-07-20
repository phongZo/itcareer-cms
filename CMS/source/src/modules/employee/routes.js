import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import DeviceEmployeeListPage from '@modules/deviceEmployee';
import DeviceEmployeeSavePage from '@modules/deviceEmployee/DeviceEmployeeSavePage';
import EmployeeListPage from '@modules/employee';
import EmployeeSavePage from '@modules/employee/EmployeeSavePage';

const paths = {
    employeeListPage: '/employee',
    employeeSavePage: '/employee/:id',
    deviceEmployeeListPage: '/employee-device',
    deviceEmployeeSavePage: '/employee-device/:id',
};

export default {
    employeeListPage: {
        path: paths.employeeListPage,
        auth: true,
        component: EmployeeListPage,
        permissions: [apiConfig.employee.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.employee,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.employee) }];
            },
        },
    },
    employeeSavePage: {
        path: paths.employeeSavePage,
        auth: true,
        component: EmployeeSavePage,
        separateCheck: true,
        permissions: [apiConfig.employee.create.permissionCode, apiConfig.employee.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.employee,
            listPageUrl: paths.employeeListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.employee), path: paths.employeeListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    deviceEmployeeListPage: {
        path: paths.deviceEmployeeListPage,
        auth: true,
        component: DeviceEmployeeListPage,
        permissions: [apiConfig.deviceEmployee.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceEmployee,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.employee), path: paths.employeeListPage },
                    { breadcrumbName: t.formatMessage(messages.deviceEmployee) },
                ];
            },
        },
    },
    deviceEmployeeSavePage: {
        path: paths.deviceEmployeeSavePage,
        auth: true,
        component: DeviceEmployeeSavePage,
        separateCheck: true,
        permissions: [apiConfig.deviceEmployee.create.permissionCode, apiConfig.deviceEmployee.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceEmployee,
            listPageUrl: paths.deviceEmployeeListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.employee), path: paths.employeeListPage },
                    {
                        breadcrumbName: t.formatMessage(messages.deviceEmployee),
                        path:
                            paths.deviceEmployeeListPage +
                            `?employeeId=${options?.employeeId}&fullName=${options?.fullName}`,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
