import React from 'react';
import { useParams } from 'react-router-dom';

import PageWrapper from '@components/common/layout/PageWrapper';
import DeviceForm from './DeviceForm';

import useTranslate from '@hooks/useTranslate';
import useSaveBase from '@hooks/useSaveBase';

import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';

const DeviceSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.device.getByIdForClient,
            create: apiConfig.device.create,
            update: apiConfig.device.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(commonMessage.device)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: id ? Number(id) : data.id,
                };
            };

            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };

            funcs.mappingData = (res) => {
                return {
                    ...res.data,
                };
            };
        },
    });

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)} loading={loading}>
            <DeviceForm
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

export default DeviceSavePage;
