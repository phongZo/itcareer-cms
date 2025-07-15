import React, { useState } from 'react';
import useTranslate from '@hooks/useTranslate';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { commonMessage } from '@locales/intl';
import { Empty, Typography } from 'antd';
import { UserOutlined, FileTextOutlined, InboxOutlined } from '@ant-design/icons';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { calculateIndex, convertUtcToLocalTime, formatDateString } from '@utils';
import { useLocation } from 'react-router-dom';
import { modalMessages } from '@constants/modalMessages';
import AvatarField from '@components/common/form/AvatarField';
import GenericModal from '@components/common/modal/GenericModal';
import useQueryParams from '@hooks/useQueryParams';
import { FieldTypes } from '@constants/formConfig';

const DeviceHistoryCostListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const [visibleModal, setVisibleModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const { pathname: pagePath } = useLocation();
    const { params } = useQueryParams();
    const deviceId = params.get('deviceId');

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: {
            getList: apiConfig.deviceHistoryCost.getList,
            delete: apiConfig.deviceHistoryCost.delete,
            update: apiConfig.deviceHistoryCost.update,
            create: apiConfig.deviceHistoryCost.create,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.getItemDetailLink = (dataRow) =>
                `${pagePath}/${dataRow.id}?deviceId=${queryFilter?.deviceId}&name=${queryFilter?.name}`;
            funcs.getCreateLink = () =>
                `${pagePath}/create?deviceId=${queryFilter?.deviceId}&name=${queryFilter?.name}`;
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({ deviceId: queryFilter?.deviceId, name: queryFilter?.name, ...filter }),
                );
            };
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.date == null) {
                    delete values.date;
                    handleFilterSearchChange(values);
                } else {
                    const date = values.date && formatDateString(values.date, DEFAULT_FORMAT);
                    handleFilterSearchChange({ ...values, date });
                }
            };
        },
    });

    const handleShowDetail = (record) => {
        setSelectedRecord(record);
        setVisibleModal(true);
    };

    const handleCloseModal = () => {
        setVisibleModal(false);
        setSelectedRecord(null);
    };

    const columns = [
        {
            title: '#',
            width: 30,
            align: 'center',
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.device),
            dataIndex: 'device',
            width: 200,
            render: (device) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {device?.image && (
                        <AvatarField
                            size="small"
                            icon={<UserOutlined />}
                            src={`${AppConstants.contentRootUrl}${device.image}`}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <span>{device ? `${device.brand} ${device.model}` : '-'}</span>
                </div>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.date),
            dataIndex: 'date',
            width: 175,
            render: (text) => convertUtcToLocalTime(text, DEFAULT_FORMAT, DEFAULT_FORMAT),
        },
        {
            title: translate.formatMessage(commonMessage.reason),
            dataIndex: 'reason',
            width: 200,
        },
        {
            title: <div style={{ textAlign: 'left' }}>{translate.formatMessage(commonMessage.repairCost)}</div>,
            dataIndex: 'cost',
            render: (cost) => `${(cost ?? 0).toLocaleString('vi-VN')}`,
            width: 150,
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.category),
            dataIndex: ['category', 'name'],
            width: 150,
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.deviceHistoryCost.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.deviceHistoryCost.delete.permissionCode]),
            },
            { width: 120 },
        ),
    ];

    const searchFields = [
        {
            key: 'date',
            placeholder: translate.formatMessage(commonMessage.date),
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            colSpan: 3,
        },
    ];

    const historySections = [
        {
            titleMessage: modalMessages.basicInfo,
            fields: [
                { labelMessage: modalMessages.reason, dataKey: 'reason', defaultMessage: 'Không có lý do' },
                {
                    labelMessage: modalMessages.description,
                    dataKey: 'description',
                    defaultMessage: 'Không có mô tả',
                },
                {
                    labelMessage: modalMessages.cost,
                    dataKey: 'cost',
                    formatter: (value) => `${(value ?? 0).toLocaleString('vi-VN')} VNĐ`,
                },
                {
                    labelMessage: modalMessages.date,
                    dataKey: 'date',
                    formatter: (value) => convertUtcToLocalTime(value, DEFAULT_FORMAT, DEFAULT_FORMAT),
                },
            ],
        },
        {
            titleMessage: modalMessages.deviceInfo,
            header: (record) => (
                <AvatarField
                    size="large"
                    icon={<InboxOutlined />}
                    src={record.device?.image ? `${AppConstants.contentRootUrl}${record.device.image}` : null}
                />
            ),
            fields: [
                { labelMessage: modalMessages.brand, dataKey: 'device.brand' },
                { labelMessage: modalMessages.model, dataKey: 'device.model' },
                { labelMessage: modalMessages.serial, dataKey: 'device.serial' },
                { labelMessage: modalMessages.simNumber, dataKey: 'device.simNumber' },
            ],
        },
        {
            titleMessage: modalMessages.categoryInfo,
            fields: [{ labelMessage: modalMessages.categoryName, dataKey: 'category.name' }],
        },
        {
            titleMessage: modalMessages.documents,
            render: (record) => {
                if (!record.deviceCostDocumentations?.length) {
                    return <Typography.Text type="secondary">Không có tài liệu</Typography.Text>;
                }
                return (
                    <div>
                        {record.deviceCostDocumentations.map((doc, index) => (
                            <div key={doc.id || index} style={{ marginBottom: 8 }}>
                                <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <a
                                    href={`${AppConstants.contentRootUrl}${doc.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#1890ff' }}
                                >
                                    {doc.fileName || `Tài liệu ${index + 1}`}
                                </a>
                                <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                                    ({convertUtcToLocalTime(doc.createdDate, DATE_FORMAT_DISPLAY, DATE_FORMAT_DISPLAY)})
                                </Typography.Text>
                            </div>
                        ))}
                    </div>
                );
            },
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                title={<Typography.Title level={3}>{translate.formatMessage(commonMessage.deviceHistoryCost)}</Typography.Title>}
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
                        onRow={(record) => ({
                            onClick: () => handleShowDetail(record),
                            style: { cursor: 'pointer' },
                        })}
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                    />
                }
            />
            <GenericModal
                visible={visibleModal}
                onClose={handleCloseModal}
                titleMessage={modalMessages.historyDetail}
                sections={historySections}
                record={selectedRecord}
            />
        </PageWrapper>
    );
};

export default DeviceHistoryCostListPage;
