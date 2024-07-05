export const keys = {
    TOKEN: 'TOKEN',
    TOKEN_EXPIRATION: 'TOKEN_EXP',
    USER_DATA: 'USER_DATA',
};

const getItem = (key: string) => {
    return localStorage.getItem(key);
};

const removeItem = (key: string) => {
    return localStorage.removeItem(key);
};

const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const forExport = {
    getItem,
    removeItem,
    setItem,
    keys,
};

export default forExport;