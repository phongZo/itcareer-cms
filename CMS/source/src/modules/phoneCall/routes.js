import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import PhoneCallListPage from '@modules/phoneCall';
import PhoneCallSavePage from '@modules/phoneCall/PhoneCallSavePage';
import routes from '@modules/contacts/routes';
import PhoneCallHistoryPage from './PhoneCallHistoryPage';

const paths = {
    phoneCallListPage: '/phone-call',
    phoneCallSavePage: '/phone-call/:id',
    phoneCallHistoryPage: 'contacts/phone-call-history',
};

export default {
    phoneCallListPage: {
        path: paths.phoneCallListPage,
        auth: true,
        component: PhoneCallListPage,
        permissions: [
            apiConfig.phoneCall.admin.getList.permissionCode,
            apiConfig.phoneCall.employee.getList.permissionCode,
        ],
        pageOptions: {
            objectName: commonMessage.phoneCall,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.phoneCall) }];
            },
        },
    },
    phoneCallSavePage: {
        path: paths.phoneCallSavePage,
        auth: true,
        component: PhoneCallSavePage,
        separateCheck: true,
        permissions: [
            apiConfig.phoneCall.admin.create.permissionCode,
            apiConfig.phoneCall.admin.update.permissionCode,
            apiConfig.phoneCall.employee.create.permissionCode,
            apiConfig.phoneCall.employee.update.permissionCode,
        ],
        pageOptions: {
            objectName: commonMessage.phoneCall,
            listPageUrl: paths.phoneCallListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.phoneCall), path: paths.phoneCallListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    phoneCallHistoryPage: {
        path: paths.phoneCallHistoryPage,
        auth: true,
        component: PhoneCallHistoryPage,
        permissions: [
            apiConfig.phoneCall.admin.getList.permissionCode,
            apiConfig.phoneCall.employee.getList.permissionCode,
        ],
        pageOptions: {
            objectName: commonMessage.phoneCall,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.contacts), path: routes.contactsListPage.path },
                    { breadcrumbName: t.formatMessage(messages.phoneCallHistory) },
                ];
            },
        },
    },
};
