import { commonMessage } from '@locales/intl';
import DeviceListPage from '.';
import DeviceSavePage from './DeviceSavePage';
import apiConfig from '@constants/apiConfig';
import DeviceEmployeeLogListPage from '@modules/devices/deviceEmployeeLog';
import DeviceHistoryCostListPage from '@modules/deviceHistoryCost';
import DeviceHistoryCostSavePage from '@modules/deviceHistoryCost/DeviceHistoryCostSavePage';
import { generatePath, matchPath } from 'react-router-dom';

const paths = {
    deviceListPage: '/devices',
    deviceSavePage: '/devices/:id',
    deviceEmployeeLogListPage: 'devices/:id/log',
    deviceHistoryCostListPage: '/devices/:deviceId/history-cost',
    deviceHistoryCostSavePage: '/devices/:deviceId/history-cost/:id',
};

export default {
    deviceListPage: {
        path: paths.deviceListPage,
        auth: true,
        component: DeviceListPage,
        permissions: [apiConfig.device.getListForClient.permissionCode],
        pageOptions: {
            objectName: commonMessage.device,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.device) }];
            },
        },
    },
    deviceSavePage: {
        path: paths.deviceSavePage,
        component: DeviceSavePage,
        permissions: [apiConfig.device.create.permissionCode, apiConfig.device.update.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.device,
            listPageUrl: paths.deviceListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.device), path: paths.deviceListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    deviceEmployeeLogListPage: {
        path: paths.deviceEmployeeLogListPage,
        component: DeviceEmployeeLogListPage,
        permissions: [apiConfig.device.getListForClient.permissionCode],
        separateCheck: true,
        auth: true,
        pageOptions: {
            objectName: commonMessage.transferHistory,
            listPageUrl: paths.deviceListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.device), path: paths.deviceListPage },
                    { breadcrumbName: t.formatMessage(messages.transferHistory) },
                ];
            },
        },
    },
    deviceHistoryCostListPage: {
        path: paths.deviceHistoryCostListPage,
        auth: true,
        component: DeviceHistoryCostListPage,
        permissions: [apiConfig.deviceHistoryCost.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.deviceHistoryCost,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(commonMessage.device), path: paths.deviceListPage },
                    {
                        breadcrumbName: t.formatMessage(messages.deviceHistoryCost),
                    },
                ];
            },
        },
    },
    deviceHistoryCostSavePage: {
        path: paths.deviceHistoryCostSavePage,
        component: DeviceHistoryCostSavePage,
        permissions: [apiConfig.deviceHistoryCost.update.permissionCode],
        auth: true,
        pageOptions: {
            objectName: commonMessage.deviceHistoryCost,
            listPageUrl: paths.deviceHistoryCostListPage,
            renderBreadcrumbs: (messages, t, title) => {
                const searchParams = new URLSearchParams(window.location.search);
                const deviceId = searchParams.get('deviceId');
            
                console.log('🔎 deviceId từ query:', deviceId);
            
                const historyCostPath = `${generatePath(paths.deviceHistoryCostListPage, {
                    deviceId,
                })}?deviceId=${deviceId}`;
            
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.device),
                        path: paths.deviceListPage,
                    },
                    {
                        breadcrumbName: t.formatMessage(commonMessage.deviceHistoryCost),
                        path: historyCostPath,
                    },
                    { breadcrumbName: title },
                ];
            },                       
            
        },
    },
};
