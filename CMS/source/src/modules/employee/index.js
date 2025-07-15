import React from 'react';
import { Button, Empty, Tag, Typography } from 'antd';

import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';

import { AppConstants, commonStatus, commonStatusColor, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { employeeStatusOptions, genderOptions } from '@constants/masterData';

import { commonMessage } from '@locales/intl';

import AvatarField from '@components/common/form/AvatarField';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';

import { UserOutlined } from '@ant-design/icons';
import { IconDevicesCog } from '@tabler/icons-react';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { useNavigate } from 'react-router-dom';
import routes from '@modules/employee/routes';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import { calculateIndex, getColumnWidth } from '@utils';

const message = defineMessages({
    viewDevice: {
        id: 'modules.employee.index.viewDevice',
        defaultMessage: 'Xem thiết bị',
    },
    tableColumn: {
        status: {
            title: {
                id: 'hook.useListBase.tableColumn.status.title',
                defaultMessage: 'Trạng thái',
            },
            [commonStatus.ACTIVE]: {
                id: 'hook.useListBase.tableColumn.status.active',
                defaultMessage: 'Hoạt động',
            },
            [commonStatus.PENDING]: {
                id: 'hook.useListBase.tableColumn.status.pending',
                defaultMessage: 'Đang chờ',
            },
            [commonStatus.LOCK]: {
                id: 'hook.useListBase.tableColumn.status.lock',
                defaultMessage: 'Khóa',
            },
        },
    },
});

const EmployeeListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const intl = useIntl();
    const navigate = useNavigate();

    const statusValues = translate
        .formatKeys(employeeStatusOptions, ['label'])
        ?.map((item) => ({ value: item.value, label: item.label }));
    const genderValues = translate.formatKeys(genderOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.employee,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => ({
                viewDevice: (dataRow) => {
                    return (
                        <BaseTooltip
                            title={intl.formatMessage(message.viewDevice)}
                            objectName={translate.formatMessage(pageOptions.objectName)}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.deviceEmployeeListPage.path +
                                            `?employeeId=${dataRow?.id}&fullName=${dataRow?.account?.fullName}`,
                                    );
                                }}
                            >
                                <IconDevicesCog size={'1em'} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
            funcs.renderStatusColumn = (columnsProps) => {
                return {
                    title: intl.formatMessage(message.tableColumn.status.title),
                    dataIndex: ['account', 'status'],
                    align: 'center',
                    ...columnsProps,
                    render: (status) => {
                        return (
                            <Tag color={commonStatusColor[status]}>
                                <div style={{ padding: '0 4px', fontSize: 14 }}>
                                    {intl.formatMessage(message.tableColumn.status[status])}
                                </div>
                            </Tag>
                        );
                    },
                };
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
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: ['account', 'avatar'],
            align: 'center',
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
            width: getColumnWidth({ width: translate.formatMessage(commonMessage.avatar).length * 10 }),
        },
        {
            title: translate.formatMessage(commonMessage.fullName),
            dataIndex: ['account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.email),
            width: getColumnWidth({ data, dataIndex: 'email', ratio: 8 }),
            dataIndex: ['account', 'email'],
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            width: translate.formatMessage(commonMessage.phone).length * 10,
            dataIndex: ['account', 'phone'],
        },
        {
            title: translate.formatMessage(commonMessage.gender),
            dataIndex: ['gender'],
            width: '100px',
            render: (text) => {
                return <Typography.Text>{genderValues[text - 1]?.label}</Typography.Text>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.department),
            dataIndex: ['department', 'name'],
            width: getColumnWidth({ data, dataIndex: 'department.name', width: 120 }),
        },
        mixinFuncs.renderStatusColumn({ width: '100px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.employee?.update?.permissionCode]),
                viewDevice: mixinFuncs.hasPermission([apiConfig?.deviceEmployee?.getList?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.employee?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.fullName),
        },
        {
            key: 'phone',
            placeholder: translate.formatMessage(commonMessage.phone),
            type: FieldTypes.NUMBER,
        },
        {
            key: 'email',
            placeholder: translate.formatMessage(commonMessage.email),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
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

export default EmployeeListPage;
