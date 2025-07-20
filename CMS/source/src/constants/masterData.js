import {
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_PENDING,
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
    GENDER_MALE,
    GENDER_FEMALE,
    GENDER_OTHER,
    DURATION_TYPE_HOUR,
    DURATION_TYPE_MINUTE,
    DURATION_TYPE_SECOND,
    PHONE_CALL_TYPE_OUTGOING,
    PHONE_CALL_TYPE_COMING,
    PHONE_CALL_TYPE_MISSING,
    PLATFORM_ANDROID,
    PLATFORM_IOS,
    MESSAGE_TYPE_SEND,
    MESSAGE_TYPE_RECEIVE,
    MESSAGE_STATUS_READ,
    MESSAGE_STATUS_UNREAD,
    STATUS_LOCK,
    PHONE_CALL_TYPE_DONE,
    PHONE_CALL_TYPE_CANCELED,
    PHONE_CALL_TYPE_TAKLING,
    DEVICE_EMPLOYEE_LOG_TRANSFER,
    DEVICE_EMPLOYEE_LOG_RETURN,
} from '@constants';
import { defineMessages } from 'react-intl';
import { nationKindMessage, actionMessage } from './intl';

const commonMessage = defineMessages({
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
    statusLock: 'Lock',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    durationTypeHour: 'Hour',
    durationTypeMinute: 'Minute',
    durationTypeSecond: 'Second',
    phoneCallTypeComing: 'Coming',
    phoneCallTypeOutGoing: 'Outgoing',
    phoneCallTypeMissing: 'Missing',
    phoneCallTypeDone: 'Done',
    phoneCallTypeCanceled: 'Canceled',
    phoneCallTypeTalking: 'Talking',
    messageTypeSend: 'Sent message',
    messageTypeReceive: 'Received message',
    messageStatusRead: 'Viewed',
    messageStatusUnread: 'Sent',
    deviceEmployeeLogTransfer: 'Transfer',
    deviceEmployeeLogReturn: 'Return',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const employeeStatusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_LOCK, label: commonMessage.statusLock, color: '#CC0000' },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
    large: '1200px',
    extraLarge: '1500px',
};

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];

export const kindPost = [
    {
        value: 1,
        label: 'Post',
        color: 'green',
    },
    {
        value: 2,
        label: 'Story',
        color: 'blue',
    },
];

export const settingGroups = {
    GENERAL: 'general',
    PAGE: 'page_config',
    REVENUE: 'revenue_config',
    TRAINING: 'training_config',
};
export const dataTypeSetting = {
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    RICHTEXT: 'richtext',
};

export const settingKeyName = {
    MONEY_UNIT: 'money_unit',
    TRAINING_UNIT: 'training_percent',
    BUG_UNIT: 'training_project_percent',
    NUMBER_OF_TRAINING_PROJECT: 'number_of_training_projects',
};

export const actionOptions = [
    {
        value: 1,
        label: actionMessage.contactForm,
    },
    { value: 2, label: actionMessage.navigation },
];

export const genderOptions = [
    { value: GENDER_MALE, label: commonMessage.genderMale, color: '#00A648' },
    { value: GENDER_FEMALE, label: commonMessage.genderFemale, color: '#FFBF00' },
    { value: GENDER_OTHER, label: commonMessage.genderOther, color: '#FFBF00' },
];

export const durationTypeOptions = [
    { value: DURATION_TYPE_HOUR, label: commonMessage.durationTypeHour },
    { value: DURATION_TYPE_MINUTE, label: commonMessage.durationTypeMinute },
    { value: DURATION_TYPE_SECOND, label: commonMessage.durationTypeSecond },
];

export const phoneCallTypeOptions = [
    { value: PHONE_CALL_TYPE_OUTGOING, label: commonMessage.phoneCallTypeOutGoing },
    { value: PHONE_CALL_TYPE_COMING, label: commonMessage.phoneCallTypeComing },
    { value: PHONE_CALL_TYPE_MISSING, label: commonMessage.phoneCallTypeMissing },
    { value: PHONE_CALL_TYPE_TAKLING, label: commonMessage.phoneCallTypeTalking },
    { value: PHONE_CALL_TYPE_DONE, label: commonMessage.phoneCallTypeDone },
    { value: PHONE_CALL_TYPE_CANCELED, label: commonMessage.phoneCallTypeCanceled },
];
export const DEVICE_PLATFORMS = [
    { label: 'Android', value: PLATFORM_ANDROID },
    { label: 'iOS', value: PLATFORM_IOS },
];

export const messageTypeOptions = [
    { value: MESSAGE_TYPE_SEND, label: commonMessage.messageTypeSend },
    { value: MESSAGE_TYPE_RECEIVE, label: commonMessage.messageTypeReceive },
];

export const messageStatusOptions = [
    { value: MESSAGE_STATUS_READ, label: commonMessage.messageStatusRead },
    { value: MESSAGE_STATUS_UNREAD, label: commonMessage.messageStatusUnread },
];

export const deviceEmployeeLogOptions = [
    { value: DEVICE_EMPLOYEE_LOG_TRANSFER, label: commonMessage.deviceEmployeeLogTransfer },
    { value: DEVICE_EMPLOYEE_LOG_RETURN, label: commonMessage.deviceEmployeeLogReturn },
];
