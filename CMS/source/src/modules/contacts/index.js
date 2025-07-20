import React, { useState } from 'react';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, TAG_KIND_CONTACT } from '@constants';
import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import AvatarField from '@components/common/form/AvatarField';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

import { TagTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';
import { calculateIndex, getColumnWidth } from '@utils';
import { useNavigate } from 'react-router-dom';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { useIntl } from 'react-intl';
import TagModal from '@modules/tag/TagModal';
import { FieldTypes } from '@constants/formConfig';

const ContactsListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const intl = useIntl();
    const [selectedContacts, setSelectedContacts] = useState(null);
    const [openedTagModal, handlersTagModal] = useDisclosure(false);
    const { execute: executeModifyTag } = useFetch(apiConfig.contacts.update);
    const { data: tagOptions } = useFetch(apiConfig?.tag?.getList, {
        immediate: true,
        params: { kind: TAG_KIND_CONTACT },
        mappingData: (response) =>
            response?.data?.content?.map((item) => ({ value: item.id, label: item.name, color: item.color })) || [],
    });

    const { data, mixinFuncs, queryFilter, loading, pagination, setData } = useListBase({
        apiConfig: apiConfig.contacts,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            funcs.additionalActionColumnButtons = () => ({
                attachTag: (dataRow) => {
                    return (
                        <BaseTooltip
                            title={
                                dataRow?.tag
                                    ? intl.formatMessage(commonMessage.modifyTag)
                                    : intl.formatMessage(commonMessage.addTag)
                            }
                            objectName={translate.formatMessage(pageOptions.objectName)}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedContacts(dataRow);
                                    handlersTagModal.open();
                                }}
                            >
                                <TagTwoTone size={'1em'} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });

    const columns = [
        {
            title: '#',
            align: 'center',
            width: 30,
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            align: 'center',
            width: Math.max(translate.formatMessage(commonMessage.avatar).length * 9.5, 100),
            render: (record) => {
                const backgroundColor = record.tag && record.tag.color ? record.tag.color : 'transparent';
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 40, backgroundColor: backgroundColor, marginRight: 10 }}></div>
                        <AvatarField
                            size="large"
                            icon={<UserOutlined />}
                            src={record.avatar ? `${AppConstants.contentRootUrl}${record.avatar}` : null}
                        />
                    </div>
                );
            },
        },

        { title: translate.formatMessage(commonMessage.fullName), dataIndex: 'name' },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
            width: translate.formatMessage(commonMessage.phone)?.length * 10,
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: 'email',
            width: getColumnWidth({ data, dataIndex: 'email', width: 150, ratio: 3 }),
        },
        {
            title: translate.formatMessage(commonMessage.address),
            width: 350,
            render: (record) =>
                `${record.address}, ${record.commune.name}, ${record.district.name}, ${record.province.name}`,
        },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig?.contacts?.update?.permissionCode]),
                attachTag: mixinFuncs.hasPermission([apiConfig?.tag?.getList?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.contacts?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
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
            key: 'tagId',
            placeholder: translate.formatMessage(commonMessage.tag),
            type: FieldTypes.SELECT,
            options: tagOptions,
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
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                        onRow={(record, index) => ({
                            onClick: () => {
                                navigate(`/contacts/phone-call-history/?contactId=${record.id}`);
                            },

                            style: { cursor: 'pointer', backgroundColor: index % 2 === 1 ? '#fefefe' : '#ffffff' },
                        })}
                    />
                }
            />
            <TagModal
                open={openedTagModal}
                onCancel={() => handlersTagModal.close()}
                tagOptions={tagOptions}
                data={selectedContacts}
                setList={setData}
                executeModifyTag={executeModifyTag}
            />
        </PageWrapper>
    );
};

export default ContactsListPage;
