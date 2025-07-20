import React from 'react';

import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';

import useTranslate from '@hooks/useTranslate';
import useListBase from '@hooks/useListBase';

import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { Button, Empty } from 'antd';
import { calculateIndex, getColumnWidth } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { CalendarOutlined, ToolFilled } from '@ant-design/icons';
import { generatePath, useNavigate } from 'react-router-dom';
import { DEVICE_PLATFORMS } from '@constants/masterData';
import routes from '@modules/devices/routes';
import { FieldTypes } from '@constants/formConfig';

const DeviceListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.device.getListForClient,
            delete: apiConfig.device.delete,
            update: apiConfig.device.update,
            create: apiConfig.device.create,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => {
                return {
                    viewTransferHistory: ({ id }) => {
                        return (
                            <BaseTooltip
                                title={translate.formatMessage(commonMessage.transferHistory)}
                                objectName={translate.formatMessage(pageOptions.objectName)}
                            >
                                <Button
                                    type="link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/device/${id}/log?deviceId=${id}`);
                                    }}
                                    style={{ padding: 0 }}
                                >
                                    <CalendarOutlined />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                    viewDeviceCostHistory: ({ id, brand, model }) => {
                        return (
                            <BaseTooltip
                                title={translate.formatMessage(commonMessage.deviceHistoryCost)}
                                objectName={translate.formatMessage(pageOptions.objectName)}
                            >
                                <Button
                                    type="link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(
                                            generatePath(routes.deviceHistoryCostListPage.path, { deviceId: id }) +
                                                `?deviceId=${id}&name=${brand} ${model}`,
                                        );
                                    }}
                                    style={{ padding: 0 }}
                                >
                                    <ToolFilled />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                };
            };
        },
    });

    const searchFields = [
        {
            key: 'serial',
            placeholder: translate.formatMessage(commonMessage.serial),
        },
        {
            key: 'simNumber',
            placeholder: translate.formatMessage(commonMessage.simNumber),
            type: FieldTypes.NUMBER,
        },
    ];

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 50,
            align: 'center',
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.serial),
            dataIndex: 'serial',
        },
        {
            title: translate.formatMessage(commonMessage.simNumber),
            dataIndex: 'simNumber',
            width: 120,
        },
        {
            title: translate.formatMessage(commonMessage.brand),
            dataIndex: 'brand',
            width: getColumnWidth({ data, dataIndex: 'brand', width: 120 }),
        },
        {
            title: translate.formatMessage(commonMessage.model),
            dataIndex: 'model',
            width: getColumnWidth({ data, dataIndex: 'model' }),
        },
        {
            title: translate.formatMessage(commonMessage.platform),
            dataIndex: ['platform'],
            render: (text) => {
                return DEVICE_PLATFORMS[text - 1]?.label;
            },
            width: getColumnWidth({ data, dataIndex: 'platform', width: 120 }),
        },
        {
            title: translate.formatMessage(commonMessage.category),
            dataIndex: ['category', 'name'],
            width: getColumnWidth({ data, dataIndex: 'category.name', width: 120 }),
        },
        {
            title: translate.formatMessage(commonMessage.employee),
            dataIndex: ['employee', 'fullName'],
            render: (text, record) => (record.employee ? record.employee.fullName : 'N/A'),
            width: getColumnWidth({ data, dataIndex: 'employee.fullName', width: 110, ratio: 11 }),
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.device?.update?.permissionCode]),
                viewTransferHistory: mixinFuncs.hasPermission([apiConfig?.deviceEmployeeLog?.getList?.permissionCode]),
                viewDeviceCostHistory: mixinFuncs.hasPermission([
                    apiConfig?.deviceHistoryCost?.getList?.permissionCode,
                ]),
                delete: mixinFuncs.hasPermission([apiConfig?.device?.delete?.permissionCode]),
            },
            { width: '150px' },
        ),
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

export default DeviceListPage;
