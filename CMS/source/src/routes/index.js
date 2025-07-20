import PageNotFound from '@components/common/page/PageNotFound';
import PageNotAllowed from '@components/common/page/PageNotAllowed';
import LoginPage from '@modules/login/index';
import Dashboard from '@modules/entry';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
import newsRoutes from '@modules/news/routes';
import nationRoutes from '@modules/nation/routes';
import GroupPermissionListPage from '@modules/groupPermission';
import PermissionSavePage from '@modules/groupPermission/PermissionSavePage';
import SettingListPage from '@modules/listSetting';
import SettingSavePage from '@modules/listSetting/SettingSavePage';
import settingsRoutes from '@modules/settings/routes';
import contactsRoutes from '@modules/contacts/routes';
import employeeRoutes from '@modules/employee/routes';
import phoneCallRoutes from '@modules/phoneCall/routes';
import deviceRoutes from '@modules/devices/routes';
import adminRoutes from '@modules/admin/routes';
import brandRoutes from '@modules/brands/routes';
import messageRoutes from '@modules/message/routes';
import tagRoutes from '@modules/tag/routes';
import departmentRoutes from '@modules/department/routes';
import deviceCatalogRoutes from '@modules/deviceCatalog/routes';
import deviceHistoryRoutes from '@modules/deviceHistoryCost/routes';
/*
	auth
		+ null: access login and not login
		+ true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: Dashboard,
        auth: true,
        title: 'Home',
    },
    settingPage: {
        path: '/settings',
        component: Dashboard,
        auth: true,
        title: 'Setting',
    },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionPage: {
        path: '/group-permission',
        component: GroupPermissionListPage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionSavePage: {
        path: '/group-permission/:id',
        component: PermissionSavePage,
        auth: true,
        title: 'Profile page',
    },
    listSettingsPage: {
        path: '/settings',
        component: SettingListPage,
        auth: true,
        title: 'Settings page',
    },
    listSettingsPageSavePage: {
        path: '/settings/:id',
        component: SettingSavePage,
        auth: true,
        title: 'Settings page',
    },
    ...adminsRoutes,
    ...newsRoutes,
    ...nationRoutes,
    ...settingsRoutes,
    ...contactsRoutes,
    ...employeeRoutes,
    ...phoneCallRoutes,
    ...deviceRoutes,
    ...adminRoutes,
    ...brandRoutes,
    ...messageRoutes,
    ...tagRoutes,
    ...departmentRoutes,
    ...deviceCatalogRoutes,
    ...deviceHistoryRoutes,
    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
