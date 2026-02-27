export const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

export const getByMonth = (year, month) => {
    const now = new Date();
    const y = parseInt(year) || now.getFullYear();
    const m = parseInt(month) || now.getMonth() + 1;

    const firstDay = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0, 23, 59, 59);

    return { firstDay, lastDay };
}

export const toNumber = (val) => {
    if (val === undefined || val === null || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? "ERROR" : num;
};