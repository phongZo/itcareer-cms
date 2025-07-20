import React from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import DeviceHistoryCostForm from './DeviceHistoryCostForm';
import useQueryParams from '@hooks/useQueryParams';
import { generatePath } from 'react-router-dom';

const DeviceHistoryCostSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { params } = useQueryParams();

    const currentPath = window.location.pathname;
    const isDeviceSpecific = currentPath.includes('/device/') && currentPath.includes('/history-cost/') && currentPath.split('/').length > 4;

    const getListUrl = isDeviceSpecific
        ? `${generatePath(pageOptions.listPageUrl, { deviceId: params.get('deviceId') })}?deviceId=${params.get('deviceId')}&name=${params.get('name')}`
        : pageOptions.listPageUrl;

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.deviceHistoryCost.getById,
            create: apiConfig.deviceHistoryCost.create,
            update: apiConfig.deviceHistoryCost.update,
        },
        options: {
            getListUrl:getListUrl,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
    });

    const breadcrumbRoutes = isDeviceSpecific
        ? pageOptions.renderBreadcrumbs(commonMessage, translate, title, {
            deviceId: params.get('deviceId'),
            name: params.get('name'),
        })
        : pageOptions.renderBreadcrumbs(commonMessage, translate, title);

    return (
        <PageWrapper loading={loading} routes={breadcrumbRoutes}>
            <DeviceHistoryCostForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail || {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default DeviceHistoryCostSavePage;