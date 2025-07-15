import apiConfig from '@constants/apiConfig';
import TagListPage from '.';
import { commonMessage } from '@locales/intl';
import TagSavePage from './TagSavePage';
import ContactTagListPage from './ContactTagListPage';
import { TAG_KIND_CONTACT, TAG_KIND_PHONE_CALL_MESSAGE } from '@constants';

const paths = {
    phoneCallTagListPage: `/tag/${TAG_KIND_PHONE_CALL_MESSAGE}`,
    contactTagListPage: `/tag/${TAG_KIND_CONTACT}`,
    tagSavePage: (kind, id) => `/tag/${kind}/${id}`,
};
export default {
    phoneCallTagListPage: {
        path: paths.phoneCallTagListPage,
        auth: true,
        component: TagListPage,
        permissions: [apiConfig.tag.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.tag,
            renderBreadcrumbs: (messages, t) => [{ breadcrumbName: t.formatMessage(messages.tag) }],
        },
    },
    contactTagListPage: {
        path: paths.contactTagListPage,
        auth: true,
        component: ContactTagListPage,
        permissions: [apiConfig.tag.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.tag,
            renderBreadcrumbs: (messages, t) => [{ breadcrumbName: t.formatMessage(messages.tag) }],
        },
    },
    tagSavePage: {
        path: '/tag/:kind/:id',
        component: TagSavePage,
        permissions: [apiConfig.tag.create.permissionCode, apiConfig.tag.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.tag,
            listPageUrl: (params) => (params.kind === '1' ? paths.phoneCallTagListPage : paths.contactTagListPage),
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(messages.tag),
                        path: options.kind === '1' ? paths.phoneCallTagListPage : paths.contactTagListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
