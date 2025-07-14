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
