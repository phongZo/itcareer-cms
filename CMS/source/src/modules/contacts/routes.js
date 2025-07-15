import { commonMessage } from '@locales/intl';
import ContactsListPage from '.';
import ContactsSavePage from './ContactSavePage';
import apiConfig from '@constants/apiConfig';

const paths = {
    contactsListPage: '/contacts',
    contactsSavePage: '/contacts/:id',
};
export default {
    contactsListPage: {
        path: paths.contactsListPage,
        auth: true,
        component: ContactsListPage,
        permissions: [apiConfig.contacts.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.directory,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.directory) }];
            },
        },
    },
    contactsSavePage: {
        path: paths.contactsSavePage,
        component: ContactsSavePage,
        permissions: [apiConfig.contacts.create.permissionCode, apiConfig.contacts.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.directory,
            listPageUrl: paths.contactsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.directory), path: paths.contactsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
