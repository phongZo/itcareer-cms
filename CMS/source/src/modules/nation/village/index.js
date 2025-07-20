import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { useLocation } from 'react-router-dom';
import routes from '@routes';
import { Empty } from 'antd';

const VillageListPage = () => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const provinceId = queryParameters.get('provinceId');
    const districtId = queryParameters.get('districtId');
    const provinceName = queryParameters.get('provinceName');
    const districtName = queryParameters.get('districtName');

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: { ...apiConfig?.nation, getList: apiConfig?.nation?.getClientList },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(commonMessage.village)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        provinceId: provinceId,
                        provinceName: provinceName,
                        districtId: districtId,
                        districtName: districtName,
                    }),
                );
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({
                    ...params,
                    parentId: districtId,
                    provinceId: null,
                    districtId: null,
                    provinceName: null,
                    districtName: null,
                });
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create?provinceId=${provinceId}&districtId=${districtId}&provinceName=${provinceName}&districtName=${districtName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?provinceId=${provinceId}&districtId=${districtId}&provinceName=${provinceName}&districtName=${districtName}`;
            };
        },
    });

    const columns = [
        { title: translate.formatMessage(commonMessage.village), dataIndex: 'name' },
        // {
        //     title: translate.formatMessage(commonMessage.description),
        //     dataIndex: 'description',
        //     width: '500px',
        // },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.nation?.update?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.nation?.delete?.permissionCode]),
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.village),
        },
    ];

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.Province),
                    path: routes.nationListPage.path,
                },
                {
                    breadcrumbName: `${provinceName}`,
                    path: routes.districtListPage.path + `?provinceId=${provinceId}&provinceName=${provinceName}`,
                },
                { breadcrumbName: `${districtName}` },
            ]}
        >
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

export default VillageListPage;
