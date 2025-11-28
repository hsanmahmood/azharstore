export const toArabicNumerals = (num) => {
    if (num === null || num === undefined) return '';
    const str = String(num);
    const westernToEastern = {
        '0': '٠',
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩',
    };
    return str.replace(/[0-9]/g, (d) => westernToEastern[d]);
};
