// Format date to GMT+3 timezone (Arabia Standard Time)
export const formatDateTimeGMT3 = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Format options for GMT+3
    const options = {
        timeZone: 'Asia/Riyadh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(date);
};

// Format only date in GMT+3
export const formatDateGMT3 = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const options = {
        timeZone: 'Asia/Riyadh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(date);
};

// Format only time in GMT+3
export const formatTimeGMT3 = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const options = {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(date);
};
