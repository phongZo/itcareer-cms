import React, { useEffect, useState } from 'react';
import { Empty, Modal, Typography } from 'antd';
import {
    IconPhoneOutgoing,
    IconPhoneIncoming,
    IconPhoneOff,
    IconPhoneCalling,
    IconPhoneCheck,
    IconPhoneX,
} from "@tabler/icons-react";
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';

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
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import BaseTable from '@components/common/table/BaseTable';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { durationTypeOptions, phoneCallTypeOptions } from '@constants/masterData';
import useAuth from '@hooks/useAuth';
import { calculateIndex, convertSecondToTimeFormatFull, formatDateToEndOfDayTime, formatDateToZeroTime, getColumnWidth } from '@utils';
import useLocale from '@hooks/useLocale';
import useFetch from '@hooks/useFetch';
import AvatarField from '@components/common/form/AvatarField';
import { AppConstants } from '@constants';
import GenericModal from '@components/common/modal/GenericModal';
import { modalMessages } from '@constants/modalMessages';
import { FieldTypes } from '@constants/formConfig';

const PhoneCallHistoryPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { phoneNumber } = useParams();
    const { profile: { kind } } = useAuth();

    const role = kind === GROUP_KIND_ADMIN ? 'admin' : kind === GROUP_KIND_EMPLOYEE ? 'employee' : '';
    const { locale } = useLocale();
    const durationValues = translate.formatKeys(durationTypeOptions, 'label');
    const phoneCallTypeValues = translate.formatKeys(phoneCallTypeOptions, ['label']);

    const { data: employeeList } = useFetch(apiConfig?.employee?.getList, {
        immediate: true,
        mappingData: (response) => response?.data?.content || [],
    });
    const employeeOptions = employeeList?.map((employee) => ({
        value: employee.id,
        label: employee?.account?.fullName,
    }));

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.phoneCall[role],
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName)?.toLowerCase() || 'lịch sử',
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

    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return `0 ${durationValues[2]?.label.toLowerCase()}`;

        const durationTimeFormatFull = convertSecondToTimeFormatFull(seconds);

        const getLabel = (value, label) => {
            if (!label) return '';
            return value > 1 && locale === LOCALE_EN ? `${label.toLowerCase()}s` : label.toLowerCase();
        };

        const hours =
            durationTimeFormatFull.format('HH') !== '00'
                ? `${parseInt(durationTimeFormatFull.format('HH'))} ${getLabel(parseInt(durationTimeFormatFull.format('HH')), durationValues[0]?.label)} `
                : '';
        const minutes =
            durationTimeFormatFull.format('mm') !== '00'
                ? `${parseInt(durationTimeFormatFull.format('mm'))} ${getLabel(parseInt(durationTimeFormatFull.format('mm')), durationValues[1]?.label)} `
                : '';
        const secondsText =
            durationTimeFormatFull.format('ss') !== '00'
                ? `${parseInt(durationTimeFormatFull.format('ss'))} ${getLabel(parseInt(durationTimeFormatFull.format('ss')), durationValues[2]?.label)} `
                : '';

        return `${hours}${minutes}${secondsText}`.trim();
    };

    const columns = [
        {
            title: '#',
            width: '30px',
            align: 'center',
            render: (text, record, index) => calculateIndex(index, pagination, queryFilter),
        },
        {
            title: translate.formatMessage(commonMessage.avatar),
            dataIndex: ['contacts', 'avatar'],
            align: 'center',
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
            width: getColumnWidth({ width: translate.formatMessage(commonMessage.avatar)?.length * 10 }),
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
                                    <Link to="/contacts/create" state={{ phoneNumber: text }}>
                                        <sup style={{ marginLeft: 4, cursor: 'pointer', fontSize: '0.8em' }}>
                                            <PlusOutlined />
                                        </sup>
                                    </Link>
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
            width: '200px',
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
                delete: mixinFuncs.hasPermission([apiConfig?.phoneCall.history?.delete?.permissionCode]),
            },
            { width: '120px' },
        ),
    ];

    const searchFields = [
        {
            key: 'employeeId',
            placeholder: translate.formatMessage(commonMessage.employee),
            type: 'select',
            options: employeeOptions,
        },
        {
            key: 'type',
            placeholder: translate.formatMessage(commonMessage.type),
            type: 'select',
            options: phoneCallTypeValues,
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

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                title={translate.formatMessage(commonMessage.phoneCallHistory)}
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
                        locale={{ emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} /> }}
                    />
                }
            />

            <GenericModal
                visible={modalVisible}
                onClose={handleCloseModal}
                titleMessage={modalMessages.callDetail}
                sections={phoneCallSections(formatDuration, phoneCallTypeValues)}
                record={selectedRecord}
            />
        </PageWrapper>
    );
};

export default PhoneCallHistoryPage;
