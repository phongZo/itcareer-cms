import React from 'react';

import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, TAG_KIND_CONTACT } from '@constants';
import apiConfig from '@constants/apiConfig';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { commonMessage } from '@locales/intl';
import { calculateIndex } from '@utils';
import { Tag } from 'antd';

const ContactTagListPage = ({ pageOptions }) => {
    const translate = useTranslate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.tag,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (filter) => {
                return prepareGetListParams({ ...filter, kind: TAG_KIND_CONTACT });
            };
        },
    });

    const columns = [
        {
            title: '#',
            width: '30px',
            align: 'center',
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.tagName),
            dataIndex: ['name'],
        },
        {
            title: translate.formatMessage(commonMessage.color),
            width: 180,
            align: 'center',
            render: (record) => (
                <Tag color={record.color} style={{ margin: 0 }}>
                    {record.color}
                </Tag>
            ),
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.tag?.update?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.tag?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.tagName),
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ContactTagListPage;
