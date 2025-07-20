import React from 'react';
import { ContactsOutlined, PhoneOutlined } from '@ant-design/icons';
import { TeamOutlined } from '@ant-design/icons';
import routes from '@routes';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';
import { IconDevices, IconSettings } from '@tabler/icons-react';

export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý người dùng" />,
        key: 'quan-ly-nguoi-dung',
        icon: <TeamOutlined size={16} />,
        permission: apiConfig.account.getList.permissionCode,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản trị viên" />,
                key: 'admin',
                path: routes.adminListPage.path,
                permission: apiConfig.account.getList.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Nhân viên" />,
                key: 'employee',
                path: routes.employeeListPage.path,
                permission: apiConfig.employee.getList.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Phòng ban" />,
                key: 'department',
                path: routes.departmentListPage.path,
                permission: [apiConfig.department.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý danh bạ" />,
        key: 'quan-ly-danh-ba',
        icon: <ContactsOutlined size={16} />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh bạ" />,
                key: 'contacts',
                path: routes.contactsListPage.path,
                permission: apiConfig.contacts.getList.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Thẻ" />,
                key: 'contact-tag',
                path: routes.contactTagListPage.path,
                permission: [apiConfig.tag.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý liên lạc" />,
        key: 'quan-ly-lien-lac',
        icon: <PhoneOutlined size={16} />,
        permission: [
            apiConfig.phoneCall.admin.getList.permissionCode,
            apiConfig.phoneCall.employee.getList.permissionCode,
        ],
        children: [
            {
                label: <FormattedMessage defaultMessage="Cuộc gọi" />,
                key: 'phone-call',
                path: routes.phoneCallListPage.path,
                permission: [
                    apiConfig.phoneCall.admin.getList.permissionCode,
                    apiConfig.phoneCall.employee.getList.permissionCode,
                ],
            },
            {
                label: <FormattedMessage defaultMessage="Tin nhắn" />,
                key: 'message',
                path: routes.messageListPage.path,
                permission: [
                    apiConfig.message.getList.permissionCode,
                    apiConfig.message.getListForClient.permissionCode,
                ],
            },
            {
                label: <FormattedMessage defaultMessage="Thẻ" />,
                key: 'phone-call-message-tag',
                path: routes.phoneCallTagListPage.path,
                permission: [apiConfig.tag.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý thiết bị" />,
        key: 'quan-ly-thiet-bi',
        icon: <IconDevices size={16} />,
        permission: [apiConfig.device.getListForAdmin.permissionCode],
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh sách thiết bị" />,
                key: 'device',
                path: routes.deviceListPage.path,
                permission: apiConfig.device.getListForClient.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Danh mục thương hiệu" />,
                key: 'brand',
                path: routes.brandListPage.path,
                permission: apiConfig.category.getList.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Danh mục thiết bị" />,
                key: 'device-category',
                path: routes.deviceCatalogListPage.path,
                permission: apiConfig.category.getList.permissionCode,
            },
            {
                label: <FormattedMessage defaultMessage="Danh sách lịch sử chi phí sửa thiết bị" />,
                key: 'device-history-cost',
                path: routes.deviceHistoryCostListAllPage.path,
                permission: apiConfig.deviceHistoryCost.getList.permissionCode,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'quan-ly-he-thong',
        icon: <IconSettings size={16} />,
        children: [
            // {
            //     label: <FormattedMessage defaultMessage="Cài đặt" />,
            //     key: 'setting',
            //     path: routes.settingsPage.path,
            // },
            {
                label: <FormattedMessage defaultMessage="Quyền hạn" />,
                key: 'role',
                path: routes.groupPermissionPage.path,
                permission: [apiConfig.groupPermission.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Tỉnh thành" />,
                key: 'province',
                path: routes.nationListPage.path,
                permission: [apiConfig.nation.getList.permissionCode],
            },
        ],
    },
];
