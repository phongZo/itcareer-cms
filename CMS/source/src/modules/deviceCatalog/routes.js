import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import DeviceCatalogListPage from '@modules/deviceCatalog';
import DeviceCatalogSavePage from '@modules/deviceCatalog/DeviceCatalogSavePage';

const paths = {
    deviceCatalogListPage: '/device-catalog',
    deviceCatalogSavePage: '/device-catalog/:id',
};

export default {
    deviceCatalogListPage: {
        path: paths.deviceCatalogListPage,
        auth: true,
        component: DeviceCatalogListPage,
        permissions: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceCatalog,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.deviceCatalog) }];
            },
        },
    },
    deviceCatalogSavePage: {
        path: paths.deviceCatalogSavePage,
        auth: true,
        component: DeviceCatalogSavePage,
        separateCheck: true,
        permissions: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceCatalog,
            listPageUrl: paths.deviceCatalogListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.deviceCatalog), path: paths.deviceCatalogListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
