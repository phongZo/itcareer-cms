import { commonMessage } from '@locales/intl';
import apiConfig from '@constants/apiConfig';
import DeviceHistoryCostListPage from '@modules/deviceHistoryCost';
import DeviceHistoryCostSavePage from '@modules/deviceHistoryCost/DeviceHistoryCostSavePage';

const paths = {
    deviceHistoryCostListAllPage: '/device/history-cost',
    deviceHistoryCostSaveAllPage: '/device/history-cost/:id',
};

export default {
    deviceHistoryCostListAllPage: {
        path: paths.deviceHistoryCostListAllPage,
        auth: true,
        component: DeviceHistoryCostListPage,
        permissions: [apiConfig.deviceHistoryCost.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceHistoryCost,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(messages.deviceHistoryCost),
                    },
                ];
            },
        },
    },
    deviceHistoryCostSaveAllPage: {
        path: paths.deviceHistoryCostSaveAllPage,
        component: DeviceHistoryCostSavePage,
        permissions: [apiConfig.deviceHistoryCost.update.permissionCode],
        auth: true,
        pageOptions: {
            objectName: commonMessage.deviceHistoryCost,
            listPageUrl: paths.deviceHistoryCostListAllPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                console.log(options);
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.deviceHistoryCost),
                        path: paths.deviceHistoryCostListAllPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
