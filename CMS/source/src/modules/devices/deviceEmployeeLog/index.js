import React from 'react';

import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';

import useTranslate from '@hooks/useTranslate';
import useListBase from '@hooks/useListBase';

import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { Empty } from 'antd';
import { calculateIndex, convertUtcToLocalTime, formatDateToEndOfDayTime, getColumnWidth } from '@utils';
import { deviceEmployeeLogOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';

const DeviceEmployeeLogListPage = ({ pageOptions }) => {
    const translate = useTranslate();

    const deviceEmployeeLogValues = translate.formatKeys(deviceEmployeeLogOptions, ['label']);

    const { data: employeeList } = useFetch(apiConfig?.employee?.getList, {
        immediate: true,
        mappingData: (response) => response?.data?.content || [],
    });

    const employeeOptions = employeeList?.map((employee) => ({
        value: employee.id,
        label: employee?.account?.fullName,
    }));

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.deviceEmployeeLog,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.date == null) {
                    delete values.date;
                    handleFilterSearchChange({ ...values });
                } else {
                    const date = values.date && formatDateToEndOfDayTime(values.date);
                    handleFilterSearchChange({ ...values, date: date });
                }
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams({ deviceId: queryFilter?.deviceId, ...filter }));
            };
        },
    });

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 50,
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
            width: getColumnWidth({ data, dataIndex: 'device.serial' }),
        },
        {
            title: translate.formatMessage(commonMessage.simNumber),
            dataIndex: ['device', 'simNumber'],
            width: 120,
        },
        {
            title: translate.formatMessage(commonMessage.employee),
            dataIndex: ['employee', 'account', 'fullName'],
            width: getColumnWidth({ data, dataIndex: 'employee.account.fullName', width: 120, ratio: 10 }),
        },
        {
            title: translate.formatMessage(commonMessage.department),
            dataIndex: ['employee', 'department', 'name'],
            width: getColumnWidth({ data, dataIndex: 'employee.department.name', width: 110 }),
        },
        {
            title: translate.formatMessage(commonMessage.transferReturnDate),
            dataIndex: 'createdDate',
            render: (text) => convertUtcToLocalTime(text, DEFAULT_FORMAT, DEFAULT_FORMAT),
            width: getColumnWidth({ width: translate.formatMessage(commonMessage.transferReturnDate).length * 8.5 }),
        },
        {
            title: translate.formatMessage(commonMessage.note),
            dataIndex: 'note',
            width: getColumnWidth({ data, dataIndex: 'note' }),
        },
        {
            title: translate.formatMessage(commonMessage.type),
            dataIndex: 'kind',
            width: 120,
            render: (text) => deviceEmployeeLogValues.find((item) => item.value === text)?.label,
        },
    ];

    const searchFields = [
        {
            key: 'employeeId',
            placeholder: translate.formatMessage(commonMessage.employee),
            type: FieldTypes.SELECT,
            options: employeeOptions,
        },
        {
            key: 'date',
            placeholder: translate.formatMessage(commonMessage.date),
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            colSpan: 3,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        onRow={(record, index) => ({
                            style: { backgroundColor: index % 2 === 1 ? '#fefefe' : '#ffffff' },
                        })}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DeviceEmployeeLogListPage;
