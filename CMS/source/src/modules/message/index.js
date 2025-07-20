import React, { useState } from 'react';
import { Modal, Typography, Empty, Button } from 'antd';
import { IconMail, IconMailOpened, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { PlusOutlined, TagTwoTone, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import {
    AppConstants,
    DATE_FORMAT_DISPLAY,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    GROUP_KIND_ADMIN,
    GROUP_KIND_EMPLOYEE,
    MESSAGE_STATUS_READ_FOR_ICON,
    MESSAGE_STATUS_UNREAD,
    MESSAGE_STATUS_UNREAD_FOR_ICON,
    MESSAGE_TYPE_RECEIVE,
    MESSAGE_TYPE_SEND,
    TAG_KIND_PHONE_CALL_MESSAGE,
} from '@constants';
import { messageStatusOptions, messageTypeOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';

import apiConfig from '@constants/apiConfig';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';

import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';

import { commonMessage } from '@locales/intl';

import { convertUtcToLocalTime, formatDateToEndOfDayTime, formatDateToZeroTime, getColumnWidth } from '@utils';
import { calculateIndex } from '@utils';

import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useFetch from '@hooks/useFetch';
import useDisclosure from '@hooks/useDisclosure';
import { useIntl } from 'react-intl';
import TagModal from '@modules/tag/TagModal';
import ContactsCreateModal from '@modules/contacts/ContactsCreateModal';
import { modalMessages } from '@constants/modalMessages';
import GenericModal from '@components/common/modal/GenericModal';

const MessageListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const intl = useIntl();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openedTagModal, handlersTagModal] = useDisclosure(false);
    const { execute: executeModifyTag } = useFetch(apiConfig.message.update);
    const [contactCreateModalVisible, setContactCreateModalVisible] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState('');

    const { data: tagOptions } = useFetch(apiConfig?.tag?.getList, {
        immediate: true,
        params: { kind: TAG_KIND_PHONE_CALL_MESSAGE },
        mappingData: (response) =>
            response?.data?.content?.map((item) => ({ value: item.id, label: item.name, color: item.color })) || [],
    });

    const messageStatusValues = translate.formatKeys(messageStatusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, setData } = useListBase({
        apiConfig: apiConfig.message,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.endDate == null && values.startDate == null) {
                    delete values.endDate;
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                    });
                } else if (values.endDate == null) {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    delete values.endDate;
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                    });
                } else if (values.startDate == null) {
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    delete values.startDate;
                    handleFilterSearchChange({
                        ...values,
                        endDate: endDate,
                    });
                } else {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    handleFilterSearchChange({
                        ...values,
                        startDate: startDate,
                        endDate: endDate,
                    });
                }
            };
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
                                    setSelectedMessage(dataRow);
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

    const handleRowClick = (record) => {
        setSelectedMessage(record);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: '#',
            align: 'center',
            width: 50,
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            align: 'center',
            render: (record) => {
                const backgroundColor = record?.tag && record.tag.color ? record.tag.color : 'transparent';
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 40, backgroundColor: backgroundColor, marginRight: 10 }}></div>
                        <AvatarField
                            size="large"
                            icon={<UserOutlined />}
                            src={record.contacts?.avatar ? `${AppConstants.contentRootUrl}${record.contacts.avatar}` : null}
                        />
                    </div>
                );
            },
            width: getColumnWidth({ width: translate.formatMessage(commonMessage.avatar).length * 10 }),
        },
        {
            title: translate.formatMessage(commonMessage.customer),
            dataIndex: ['phoneNumber'],
            render: (text, record) => {
                let MailIcon = record.isRead === MESSAGE_STATUS_UNREAD_FOR_ICON ? IconMail : IconMailOpened;
                let mailColor = record.isRead === MESSAGE_STATUS_UNREAD_FOR_ICON ? 'blue' : 'limegreen';
                let ArrowIcon = record.type === MESSAGE_TYPE_SEND ? IconArrowUp : IconArrowDown;
                let arrowColor = record.type === MESSAGE_TYPE_SEND ? 'red' : 'green';

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <MailIcon size={22} stroke={1.5} color={mailColor} />
                            <ArrowIcon size={18} stroke={1.5} color={arrowColor} />
                            <span>{record.contacts?.name ? record.contacts.name : text || 'N/A'}</span>
                            {/* Nếu chưa có tên contact và có số điện thoại, hiển thị nút "+" để mở modal tạo contact */}
                            {!record.contacts?.name && text && (
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhone(text);
                                        setContactCreateModalVisible(true);
                                    }}
                                >
                                    <PlusOutlined style={{ marginLeft: 4, cursor: 'pointer', fontSize: '0.8em' }} />
                                </Button>
                            )}
                        </div>
                        {record.contacts?.name && text && (
                            <Typography.Text type="secondary" style={{ fontSize: '12px', marginLeft: '30px' }}>
                                {text}
                            </Typography.Text>
                        )}
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.employee),
            dataIndex: ['employee', 'fullName'],
            width: 160,
        },
        {
            title: translate.formatMessage(commonMessage.sentOrReceivedTime),
            render: (text, record) => convertUtcToLocalTime(record.createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT),
            width: 200,
        },
        mixinFuncs.renderActionColumn(
            {
                //edit: mixinFuncs.hasPermission([apiConfig?.message?.update?.permissionCode]),
                attachTag: mixinFuncs.hasPermission([apiConfig?.tag?.getList?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.message?.delete?.permissionCode]),
            },
            { width: 120 },
        ),
    ];

    const searchFields = [
        {
            key: 'message',
            placeholder: translate.formatMessage(commonMessage.message),
            colSpan: 3,
        },
        {
            key: 'isRead',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: messageStatusValues,
            colSpan: 3,
        },
        {
            key: 'phoneNumber',
            placeholder: translate.formatMessage(commonMessage.phone),
            colSpan: 3,
            type: FieldTypes.NUMBER,
        },
        {
            key: 'startDate',
            placeholder: translate.formatMessage(commonMessage.startDate),
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            colSpan: 3,
        },
        {
            key: 'endDate',
            placeholder: translate.formatMessage(commonMessage.endDate),
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            colSpan: 3,
        },
        {
            key: 'tagId',
            placeholder: translate.formatMessage(commonMessage.tag),
            type: FieldTypes.SELECT,
            options: tagOptions,
            colSpan: 3,
        },
    ];

    const messageSections = [
        {
            titleMessage: modalMessages.customerInfo,
            header: (record) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={record.contacts?.avatar ? `${AppConstants.contentRootUrl}${record.contacts.avatar}` : null}
                />
            ),
            fields: [
                { labelMessage: modalMessages.customerName, dataKey: 'contacts.name' },
                {
                    labelMessage: modalMessages.phoneNumber,
                    dataKey: 'contacts.phone',
                    formatter: (value) => value,
                },
            ],
        },
        {
            titleMessage: modalMessages.messageInfo,
            fields: [
                {
                    labelMessage: modalMessages.status,
                    dataKey: 'isRead',
                    formatter: (value) =>
                        value
                            ? translate.formatMessage(modalMessages.read)
                            : translate.formatMessage(modalMessages.unread),
                },
                {
                    labelMessage: modalMessages.sendTime,
                    dataKey: 'createdDate',
                    formatter: (value) => convertUtcToLocalTime(value, DEFAULT_FORMAT, DEFAULT_FORMAT),
                },
                {
                    render: (record) => (
                        <>
                            <p>
                                <strong>{translate.formatMessage(modalMessages.content)}:</strong>
                            </p>
                            <p>{record.message}</p>
                        </>
                    ),
                },
            ],
        },
        {
            titleMessage: modalMessages.deviceInfo,
            fields: [
                { labelMessage: modalMessages.brand, dataKey: 'device.brand' },
                { labelMessage: modalMessages.model, dataKey: 'device.model' },
                { labelMessage: modalMessages.serial, dataKey: 'device.serial' },
                { labelMessage: modalMessages.simNumber, dataKey: 'device.simNumber' },
            ],
        },
        {
            titleMessage: modalMessages.employeeInfo,
            header: (record) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={
                        record?.employee?.avatarPath
                            ? `${AppConstants.contentRootUrl}${record.employee.avatarPath}`
                            : null
                    }
                />
            ),
            fields: [
                { labelMessage: modalMessages.employee, dataKey: 'employee.fullName' },
                { labelMessage: modalMessages.position, dataKey: 'employee.position' },
            ],
        },
    ];

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedMessage(null);
    };

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter, alignSearcField: 'right' })}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: { cursor: 'pointer' },
                        })}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
            <GenericModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                titleMessage={modalMessages.messageDetails}
                sections={messageSections}
                record={selectedMessage}
            />
            <TagModal
                open={openedTagModal}
                onCancel={() => handlersTagModal.close()}
                tagOptions={tagOptions}
                data={selectedMessage}
                setList={setData}
                executeModifyTag={executeModifyTag}
            />
            <ContactsCreateModal
                visible={contactCreateModalVisible}
                onClose={() => setContactCreateModalVisible(false)}
                onSubmit={(values) => {
                    console.log('Creating contact with values:', values);
                    setContactCreateModalVisible(false);
                }}
                pageOptions={pageOptions}
                phoneNumber={selectedPhone}
            />
        </PageWrapper>
    );
};

export default MessageListPage;
