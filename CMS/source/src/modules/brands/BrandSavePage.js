import React from 'react';
import { useParams } from 'react-router-dom';

import PageWrapper from '@components/common/layout/PageWrapper';
import BrandForm from '@modules/brands/BrandForm';

import apiConfig from '@constants/apiConfig';

import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';

import { commonMessage } from '@locales/intl';
import { ERROR_CATEGORY_EXIST } from '@constants';

const BrandSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.category.getById,
            create: apiConfig.category.create,
            update: apiConfig.category.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => ({
                ...data,
                id: id,
            });
            funcs.prepareCreateData = (data) => ({
                ...data,
            });
            funcs.mappingData = (data) => ({
                ...data.data,
            });
            funcs.handleShowErrorMessage = (err, showErrorMessage) => {
                if (err && err?.code == ERROR_CATEGORY_EXIST)
                    showErrorMessage(translate.formatMessage(commonMessage.categoryExisted) || err.message, translate);
                else showErrorMessage(`${mixinFuncs.getActionName()} failed. Please try again!`, translate);
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <BrandForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default BrandSavePage;
