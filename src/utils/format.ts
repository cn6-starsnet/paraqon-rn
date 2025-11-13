import moment from 'moment';

export const formatCurrency = ({ currency = "hkd", price = 0, isConvert = true, exchangeRate = 1 }) => {
    if (isConvert) {
        return Intl.NumberFormat('en-US', {
            style: "currency",
            currency: currency.toUpperCase(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            currencyDisplay: 'code',
        }).format(price * exchangeRate);
    }
    return Intl.NumberFormat('en-US', {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'code',
    }).format(price);
}

export const formatTimeUnit = (time) => {
    return time < 10 ? '0' + time : time;
}

export const formatObjectId = (objectId) => {
    return objectId.slice(-6)
}

export const formatDateTime = (datetime: string) => {
    return moment(datetime).locale('zh-cn').format('YYYY年M月D日 HH:mm');
};

export const formatDate = (datetime: string) => {
    return moment(datetime).locale('zh-cn').format('YYYY年M月D日');
};