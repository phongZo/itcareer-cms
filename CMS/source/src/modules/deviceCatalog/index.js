import React from 'react';

import useTranslate from '@hooks/useTranslate';

import { AppConstants, CATEGORY_KIND_DEVICE, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';

import { commonMessage } from '@locales/intl';

import AvatarField from '@components/common/form/AvatarField';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';

import { InboxOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { calculateIndex } from '@utils';

const DeviceCatalogListPage = ({ pageOptions }) => {
    const translate = useTranslate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            ...apiConfig.category,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (filter) => {
                return prepareGetListParams({ ...filter, kind: CATEGORY_KIND_DEVICE });
            };
        },
    });

    const columns = [
        {
            title: '#',
            width: 30,
            align: 'center',
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.image),
            dataIndex: 'image',
            align: 'center',
            width: 100,
            render: (image) => (
                <AvatarField
                    size="large"
                    icon={<InboxOutlined />}
                    src={image ? `${AppConstants.contentRootUrl}${image}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.Name),
            dataIndex: 'name',
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.category.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.category.delete.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.Name),
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
                        onRow={(record, index) => ({
                            style: { backgroundColor: index % 2 === 1 ? '#fefefe' : '#ffffff' },
                        })}
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DeviceCatalogListPage;
