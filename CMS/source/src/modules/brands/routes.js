import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import BrandListPage from '@modules/brands';
import BrandSavePage from '@modules/brands/BrandSavePage';

const paths = {
    brandListPage: '/brand',
    brandSavePage: '/brand/:id',
};

export default {
    brandListPage: {
        path: paths.brandListPage,
        auth: true,
        component: BrandListPage,
        permissions: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.brand,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(commonMessage.brand) }];
            },
        },
    },
    brandSavePage: {
        path: paths.brandSavePage,
        auth: true,
        component: BrandSavePage,
        separateCheck: true,
        permissions: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.brand,
            listPageUrl: paths.brandListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(commonMessage.brand), path: paths.brandListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};