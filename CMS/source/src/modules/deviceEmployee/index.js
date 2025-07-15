import React from 'react';

import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { commonMessage } from '@locales/intl';
import { useLocation } from 'react-router-dom';
import { Empty, Typography } from 'antd';
import { calculateIndex, convertUtcToLocalTime, getColumnWidth } from '@utils';

const DeviceEmployeeListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { pathname } = useLocation();

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.deviceEmployee,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.getCreateLink = () => {
                return `${pathname}/create?employeeId=${queryFilter?.employeeId}&fullName=${queryFilter?.fullName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pathname}/${dataRow.id}?employeeId=${queryFilter?.employeeId}&fullName=${queryFilter?.fullName}`;
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        employeeId: queryFilter?.employeeId,
                        fullName: queryFilter?.fullName,
                        ...filter,
                    }),
                );
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
            title: translate.formatMessage(commonMessage.device),
            render: (record) => `${record.device.brand} ${record.device.model}`,
        },
        {
            title: translate.formatMessage(commonMessage.serial),
            dataIndex: ['device', 'serial'],
            width: getColumnWidth({ data, dataIndex: 'device.serial', ratio: 8 }),
        },
        {
            title: translate.formatMessage(commonMessage.employee),
            dataIndex: ['employee', 'account', 'fullName'],
            width: getColumnWidth({ data, dataIndex: 'employee.account.fullName', width: 120, ratio: 10 }),
        },
        {
            title: translate.formatMessage(commonMessage.transferDate),
            dataIndex: 'dateTransfer',
            render: (text, record) => convertUtcToLocalTime(record.dateTransfer, DEFAULT_FORMAT, DEFAULT_FORMAT),
            width: getColumnWidth({ data, dataIndex: 'dateTransfer', width: 150, ratio: 9 }),
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.deviceEmployee?.update?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.deviceEmployee?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'deviceId',
            placeholder: translate.formatMessage(commonMessage.device),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.device.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: `${item.brand} ${item.model}`,
            }),
        },
    ];
    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                title={
                    <Typography.Title level={3} style={{ marginTop: '-10px' }}>
                        {queryFilter?.fullName}
                    </Typography.Title>
                }
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

export default DeviceEmployeeListPage;
