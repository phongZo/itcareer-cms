import React, { useEffect, useState } from 'react';
import { Empty, Typography, Button } from 'antd';
import {
    IconPhoneOutgoing,
    IconPhoneIncoming,
    IconPhoneOff,
    IconPhoneCalling,
    IconPhoneCheck,
    IconPhoneX,
} from "@tabler/icons-react";
import { PlusOutlined, UserOutlined, TagTwoTone } from '@ant-design/icons';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import {
    DATE_FORMAT_DISPLAY,
    DEFAULT_TABLE_ITEM_SIZE,
    GROUP_KIND_ADMIN,
    GROUP_KIND_EMPLOYEE,
    LOCALE_EN,
    PHONE_CALL_TYPE_CANCELED,
    PHONE_CALL_TYPE_COMING,
    PHONE_CALL_TYPE_DONE,
    PHONE_CALL_TYPE_MISSING,
    PHONE_CALL_TYPE_OUTGOING,
    PHONE_CALL_TYPE_TAKLING,
    TAG_KIND_PHONE_CALL_MESSAGE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { durationTypeOptions, phoneCallTypeOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import { calculateIndex, convertSecondToTimeFormatFull, formatDateToEndOfDayTime, formatDateToZeroTime } from '@utils';
import useLocale from '@hooks/useLocale';
import useFetch from '@hooks/useFetch';
import AvatarField from '@components/common/form/AvatarField';
import { AppConstants } from '@constants';
import { useIntl } from 'react-intl';
import useDisclosure from '@hooks/useDisclosure';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import TagModal from '@modules/tag/TagModal';
import ContactsCreateModal from '@modules/contacts/ContactsCreateModal';
import { FieldTypes } from '@constants/formConfig';
import { modalMessages } from '@constants/modalMessages';
import GenericModal from '@components/common/modal/GenericModal';
import { size } from 'lodash';

const PhoneCallListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const intl = useIntl();
    const { profile: { kind } } = useAuth();
    const role = kind === GROUP_KIND_ADMIN ? 'admin' : kind === GROUP_KIND_EMPLOYEE ? 'employee' : '';
    const { locale } = useLocale();
    const durationValues = translate.formatKeys(durationTypeOptions, 'label');
    const phoneCallTypeValues = translate.formatKeys(phoneCallTypeOptions, ['label']);
    const [openedTagModal, handlersTagModal] = useDisclosure(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const { execute: executeModifyTag } = useFetch(apiConfig.phoneCall.admin.update);
    const [contactCreateModalVisible, setContactCreateModalVisible] = useState(false);
    const [selectedPhone, setSelectedPhone] = useState('');

    const { data: tagOptions } = useFetch(apiConfig?.tag?.getList, {
        immediate: true,
        params: { kind: TAG_KIND_PHONE_CALL_MESSAGE },
        mappingData: (response) => response?.data?.content?.map((item) => ({ value: item.id, label: item.name, color: item.color })) || [],
    });

    const { data: employees } = useFetch(apiConfig?.employee?.getList, {
        immediate: true,
        mappingData: (response) => response?.data?.content?.map((item) => ({ value: item.id, label: item.account.fullName })) || [],
    });

    const { data, mixinFuncs, queryFilter, loading, pagination, setData } = useListBase({
        apiConfig: apiConfig.phoneCall[role],
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase(),
        },
        override: (funcs) => {
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.endDate == null && values.startDate == null) {
                    delete values.endDate;
                    delete values.startDate;
                    handleFilterSearchChange({ ...values });
                } else if (values.endDate == null) {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    console.log('🚀 ~ PhoneCallListPage ~ startDate:', startDate);
                    delete values.endDate;
                    handleFilterSearchChange({ ...values, startDate: startDate });
                } else if (values.startDate == null) {
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    delete values.startDate;
                    handleFilterSearchChange({ ...values, endDate: endDate });
                } else {
                    const startDate = values.startDate && formatDateToZeroTime(values.startDate);
                    const endDate = values.endDate && formatDateToEndOfDayTime(values.endDate);
                    handleFilterSearchChange({ ...values, startDate: startDate, endDate: endDate });
                }
            };

            funcs.additionalActionColumnButtons = () => ({
                attachTag: (dataRow) => {
                    return (
                        <BaseTooltip
                            title={dataRow?.tag
                                ? intl.formatMessage(commonMessage.modifyTag)
                                : intl.formatMessage(commonMessage.addTag)}
                            objectName={translate.formatMessage(pageOptions.objectName)}
                        >
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRow(dataRow);
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

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleShowModal = (record) => {
        setSelectedRecord(record);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedRecord(null);
    };

    // Hàm định dạng thời gian
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds))
            return `0 ${durationValues[2]?.label.toLowerCase()}`;

        const durationTimeFormatFull = convertSecondToTimeFormatFull(seconds);

        const getLabel = (value, label) => {
            if (!label) return '';
            return value > 1 && locale === LOCALE_EN ? `${label.toLowerCase()}s` : label.toLowerCase();
        };

        const hours =
          durationTimeFormatFull.format('HH') !== '00'
              ? `${parseInt(durationTimeFormatFull.format('HH'))} ${getLabel(
                  parseInt(durationTimeFormatFull.format('HH')),
                  durationValues[0]?.label,
              )} `
              : '';
        const minutes =
          durationTimeFormatFull.format('mm') !== '00'
              ? `${parseInt(durationTimeFormatFull.format('mm'))} ${getLabel(
                  parseInt(durationTimeFormatFull.format('mm')),
                  durationValues[1]?.label,
              )} `
              : '';
        const secondsText =
          durationTimeFormatFull.format('ss') !== '00'
              ? `${parseInt(durationTimeFormatFull.format('ss'))} ${getLabel(
                  parseInt(durationTimeFormatFull.format('ss')),
                  durationValues[2]?.label,
              )} `
              : '';

        return `${hours}${minutes}${secondsText}`.trim();
    };

    const columns = [
        {
            title: '#',
            width: '30px',
            align: 'center',
            render: (text, record, index) =>
                calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            align: 'center',
            width: Math.max(
                translate.formatMessage(commonMessage.avatar).length * 9.5,
                100,
            ),
            render: (record) => {
                const backgroundColor = record?.tag && record.tag.color ? record.tag.color : 'transparent';
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 40, backgroundColor: backgroundColor, marginRight: 10 }}></div>
                        <AvatarField
                            size="large"
                            icon={<UserOutlined />}
                            src={record?.contacts?.avatar ? `${AppConstants.contentRootUrl}${record.contacts.avatar}` : null}
                        />
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.customer),
            dataIndex: ['phoneNumber'],
            width: '200px',
            render: (text, record) => {
                const { contacts, type } = record;
                let IconComponent;
                switch (type) {
                                case PHONE_CALL_TYPE_OUTGOING:
                                    IconComponent = <IconPhoneOutgoing color="green" size={20} />;
                                    break;
                                case PHONE_CALL_TYPE_COMING:
                                    IconComponent = <IconPhoneIncoming color="blue" size={20} />;
                                    break;
                                case PHONE_CALL_TYPE_MISSING:
                                    IconComponent = <IconPhoneOff color="red" size={20} />;
                                    break;
                                case PHONE_CALL_TYPE_TAKLING:
                                    IconComponent = <IconPhoneCalling color="purple" size={20} />;
                                    break;
                                case PHONE_CALL_TYPE_DONE:
                                    IconComponent = <IconPhoneCheck color="green" size={20} />;
                                    break;
                                case PHONE_CALL_TYPE_CANCELED:
                                    IconComponent = <IconPhoneX color="gray" size={20} />;
                                    break;
                                default:
                                    IconComponent = null;
                }
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {IconComponent}
                            {contacts?.name ? (
                                <span style={{ marginLeft: 8 }}>{contacts.name}</span>
                            ) : (
                                <>
                                    <span style={{ marginLeft: 8 }}>{text}</span>
                                    {/* Khi click dấu "+" sẽ mở ContactsCreateModal và truyền phoneNumber */}
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPhone(text);
                                            setContactCreateModalVisible(true);
                                        }}
                                    >
                                        <PlusOutlined />
                                    </Button>
                                </>
                            )}
                        </div>
                        {contacts?.name && (
                            <Typography.Text type="secondary" style={{ fontSize: '12px', marginLeft: 28 }}>
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
        },
        {
            title: translate.formatMessage(commonMessage.device),
            render: (text, record) => (
                <p>
                    {record.device.brand} {record.device.model}
                </p>
            ),
            onCell: (record) => ({
                style: {
                    width: `${Math.max(110, `${record.device.brand} ${record.device.model}`.length * 7)}px`,
                    whiteSpace: 'nowrap',
                },
            }),
        },
        {
            title: translate.formatMessage(commonMessage.callTime),
            width: '175px',
            dataIndex: ['callTime'],
        },
        {
            title: translate.formatMessage(commonMessage.duration),
            dataIndex: ['duration'],
            render: (text) => formatDuration(text),
            onCell: (record) => ({
                style: {
                    width: `${Math.max(110, formatDuration(record.duration).length * 8)}px`,
                    whiteSpace: 'nowrap',
                },
            }),
        },
        mixinFuncs.renderActionColumn(
            {
                attachTag: mixinFuncs.hasPermission([apiConfig?.tag?.getList?.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig?.phoneCall[role]?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'phoneNumber',
            placeholder: translate.formatMessage(commonMessage.phone),
            colSpan: 3,
            type: FieldTypes.NUMBER,
        },
        {
            key: 'employeeId',
            placeholder: translate.formatMessage(commonMessage.employee),
            type: FieldTypes.SELECT,
            options: employees,
        },
        {
            key: 'type',
            placeholder: translate.formatMessage(commonMessage.type),
            type: FieldTypes.SELECT,
            options: phoneCallTypeValues,
            colSpan: 3,
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

    const phoneCallSections = (formatDuration, phoneCallTypeValues) => [
        {
            titleMessage: modalMessages.customerInfo,
            header: (record) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={
                        record.contacts?.avatar
                            ? `${AppConstants.contentRootUrl}${record.contacts.avatar}`
                            : null
                    }
                />
            ),
            fields: [
                { labelMessage: modalMessages.customerName, dataKey: 'contacts.name' },
                { labelMessage: modalMessages.phoneNumber, dataKey: 'phoneNumber' },
                { labelMessage: modalMessages.email, dataKey: 'contacts.email' },
                { labelMessage: modalMessages.address, dataKey: 'contacts.address' },
                { labelMessage: modalMessages.commune, dataKey: 'contacts.commune.name' },
                { labelMessage: modalMessages.district, dataKey: 'contacts.district.name' },
                { labelMessage: modalMessages.province, dataKey: 'contacts.province.name' },
            ],
        },
        {
            titleMessage: modalMessages.callInfo,
            fields: [
                { labelMessage: modalMessages.callTime, dataKey: 'callTime' },
                { labelMessage: modalMessages.createdDate, dataKey: 'createdDate' },
                { labelMessage: modalMessages.modifiedDate, dataKey: 'modifiedDate' },
                {
                    labelMessage: modalMessages.duration,
                    dataKey: 'duration',
                    formatter: formatDuration,
                },
                { labelMessage: modalMessages.status, dataKey: 'status' },
                {
                    labelMessage: modalMessages.callType,
                    dataKey: 'type',
                    formatter: (value) =>
                        phoneCallTypeValues.find((item) => item.value === value)?.label || value,
                },
            ],
        },
        {
            titleMessage: modalMessages.deviceInfo,
            fields: [
                {
                    labelMessage: modalMessages.device,
                    dataKey: 'device',
                    formatter: (value) => `${value?.brand || ''} ${value?.model || ''}`.trim(),
                },
                { labelMessage: modalMessages.serial, dataKey: 'device.serial' },
                { labelMessage: modalMessages.simNumber, dataKey: 'device.simNumber' },
            ],
        },
        {
            titleMessage: modalMessages.employeeInfo,
            fields: [
                { labelMessage: modalMessages.employee, dataKey: 'employee.fullName' },
                { labelMessage: modalMessages.phoneNumber, dataKey: 'employee.phone' },
                { labelMessage: modalMessages.email, dataKey: 'employee.email' },
            ],
        },
    ];

    const handleClose = () => setModalVisible(false);
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
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        onRow={(record) => ({
                            onClick: () => handleShowModal(record),
                            style: { cursor: 'pointer' },
                        })}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
            <TagModal
                open={openedTagModal}
                onCancel={() => handlersTagModal.close()}
                tagOptions={tagOptions}
                data={selectedRow}
                setList={setData}
                executeModifyTag={executeModifyTag}
            />

            {/* Modal hiển thị chi tiết cuộc gọi */}
            <GenericModal
                visible={modalVisible}
                onClose={handleClose}
                titleMessage={modalMessages.callDetail}
                sections={phoneCallSections(formatDuration, phoneCallTypeValues)}
                record={selectedRecord}
            />
            {/* ContactsCreateModal được mở khi click dấu "+" và nhận phoneNumber */}
            <ContactsCreateModal
                visible={contactCreateModalVisible}
                onClose={() => setContactCreateModalVisible(false)}
                onSubmit={() => setContactCreateModalVisible(false)}
                pageOptions={pageOptions}
                phoneNumber={selectedPhone}
            />
        </PageWrapper>
    );
};

export default PhoneCallListPage;
