const getItem = (key: string) => {
    return localStorage.getItem(key);
};

const removeItem = (key: string) => {
    return localStorage.removeItem(key);
};

const setItem = (key: string, value: any) => {
    localStorage.setItem(key, value);
};

export const keys = {
    TOKEN: 'TOKEN',
    TOKEN_EXPIRATION: 'TOKEN_EXP',
}

const forExport = {
    getItem,
    removeItem,
    setItem
};

export default forExport;