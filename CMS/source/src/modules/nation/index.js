import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE, PROVINCE_KIND } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { Button, Empty } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { useNavigate } from 'react-router-dom';
import routes from '@routes';
import { RightSquareOutlined } from '@ant-design/icons';
import styles from './nation.module.scss';
import { calculateIndex } from '@utils';

const message = defineMessages({
    objectName: 'Province',
});

const ProvinceListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.nation,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, kind: PROVINCE_KIND });
            };
            funcs.additionalActionColumnButtons = () => ({
                district: ({ id, name }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.district)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.nationListPage.path + `/district?provinceId=${id}&provinceName=${name}`,
                                );
                            }}
                        >
                            <RightSquareOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.nationListPage.path + `/district?provinceId=${record.id}&provinceName=${record.name}`);
    };
    const columns = [
        {
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
            title: '#',
            width: '30px',
        },
        {
            title: translate.formatMessage(commonMessage.Province),
            dataIndex: 'name',
            render: (name, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {name}
                </div>
            ),
        },
        // {
        //     title: translate.formatMessage(commonMessage.description),
        //     dataIndex: 'description',
        //     width: '500px',
        // },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.nation?.update?.permissionCode]),
                district: mixinFuncs.hasPermission([apiConfig?.nation?.getList?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.nation?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.Province),
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.Province) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default ProvinceListPage;
