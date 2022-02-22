var baseClient = window._axios.getClient('https://hk4e-api.mihoyo.com');

// --------- gacha_info --------------
var getGachaLog = (params) => baseClient.get('/event/gacha_info/api/getGachaLog', params);

export default {
    getGachaLog
};