import React from 'react';

import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

import { Button, Empty } from 'antd';
import { calculateIndex, getColumnWidth } from '@utils';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { IconUsersGroup } from '@tabler/icons-react';
import { generatePath, useNavigate } from 'react-router-dom';
import routes from '@routes';

const DeparmentListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.department,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => {
                return {
                    viewEmployee: ({ id, name }) => {
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.employee)}>
                                <Button
                                    type="link"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(
                                            generatePath(
                                                `${routes.departmentEmployeeListPage.path}?departmentName=${name}&departmentId=${id}`,
                                                { id },
                                            ),
                                        );
                                    }}
                                    style={{ padding: 0, height: '20px', lineHeight: 0 }}
                                >
                                    <IconUsersGroup stroke={1.5} size={18} />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                };
            };
        },
    });

    const columns = [
        {
            title: '#',
            align: 'center',
            width: 30,
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        { title: translate.formatMessage(commonMessage.departmentName), dataIndex: 'name' },
        // {
        //     title: translate.formatMessage(commonMessage.description),
        //     dataIndex: 'description',
        //     width: getColumnWidth({ data, dataIndex: 'description', ratio: 8 }),
        // },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.department?.update?.permissionCode]),
                viewEmployee: true,
                delete: mixinFuncs.hasPermission([apiConfig?.department?.delete?.permissionCode]),
            },
            { width: '150px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.departmentName),
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

export default DeparmentListPage;
