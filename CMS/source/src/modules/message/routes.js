import { commonMessage } from '@locales/intl';

import apiConfig from '@constants/apiConfig';
import MessageListPage from '.';
import MessageSavePage from './MessageSavePage';

const paths = {
    messageListPage: '/message',
    messageSavePage: '/message/:id',
};
export default {
    messageListPage: {
        path: paths.messageListPage,
        auth: true,
        component: MessageListPage,
        permissions: [apiConfig.message.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.message,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.message) }];
            },
        },
    },
    messageSavePage: {
        path: paths.messageSavePage,
        component: MessageSavePage,
        permissions: [apiConfig.message.create.permissionCode, apiConfig.message.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.message,
            listPageUrl: paths.messageListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.message), path: paths.messageListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
