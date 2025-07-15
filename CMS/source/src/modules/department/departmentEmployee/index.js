import React from 'react';

import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

import { Empty, Typography } from 'antd';
import { calculateIndex, getColumnWidth } from '@utils';
import { genderOptions } from '@constants/masterData';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined } from '@ant-design/icons';

const DepartmentEmployeeListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const genderValues = translate.formatKeys(genderOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.employee,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
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
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                title={
                    <Typography.Title level={3} style={{ marginTop: '-10px' }}>
                        {queryFilter?.departmentName}
                    </Typography.Title>
                }
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

export default DepartmentEmployeeListPage;
