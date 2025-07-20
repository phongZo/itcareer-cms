import React from 'react';
import { useParams } from 'react-router-dom';

import { GROUP_KIND_ADMIN } from '@constants';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import useSaveBase from '@hooks/useSaveBase';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import MessageForm from './MessageForm';

const MessageSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const { data } = useFetch(apiConfig.groupPermission.getGroupList, {
        immediate: true,
        mappingData: (res) => res.data?.content?.map((item) => ({ value: item.id, label: item.name })),
        params: {
            kind: GROUP_KIND_ADMIN,
        },
    });
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.message.getById,
            create: apiConfig.message.create,
            update: apiConfig.message.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };

            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <MessageForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={false}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                groups={data || []}
            />
        </PageWrapper>
    );
};

export default MessageSavePage;
