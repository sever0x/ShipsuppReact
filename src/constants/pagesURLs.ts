import * as pages from './pages';

const result = {
    [pages.home]: `/${pages.home}`,
    [pages.login]: `/${pages.login}`,
    [pages.register]: `/${pages.register}`,
    [pages.forgotPassword]: `/${pages.forgotPassword}`,
    [pages.profile]: `/${pages.profile}`,
    [pages.catalog]: `/${pages.catalog}`,
    [pages.orders]: `/${pages.orders}`,
    [pages.chats]: `/${pages.chats}`,
    [pages.permissions]: `/${pages.settings}/${pages.permissions}`,

    // services
    [pages.support]: `/${pages.support}`,

    [pages.notFound]: `/${pages.notFound}`,
};

export default result;