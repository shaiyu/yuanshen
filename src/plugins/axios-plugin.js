import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/json';

//apiUrl: 'http://www.xxxx.com' ,
let config = {
    //使用vuex中的url
    baseURL: global.baseUrl,
    timeout: 60 * 1000 * 5, // Timeout
    responseType: 'json', // default
    // paramsSerializer: function (params) {
    //     return qs.stringify(params, {arrayFormat: 'brackets'})
    // },
    // transformRequest: function (data, headers) {
    //     // 对 data 进行任意转换处理
    //     return data;
    // },
    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
    },
    headers: {
        //'Authorization': 'Bearer',
        //'Accept': 'application/json',
        //'Content-Type': 'application/json',
        //"Access-Control-Allow-Origin": "*",
        //"x-requested-with": "XMLHttpRequest"
    },
    withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // Do something with response data
       
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);
_axios._get = function (path, query) {
    console.log("_get", path, query);
    return new Promise((resolve, reject) => {
        config.params = query;
        _axios.get(path, config).then(function (resp) {
            resolve(resp.data);
        }).catch(function (err) {
            console.log(err);
            reject(err);
        });
    })
}

_axios._post = function (path, data) {
    return new Promise((resolve, reject) => {
        config.params = null;
        //config.data = data; 同时写数组会转成对象
        _axios.post(path, data, config).then(function (resp) {
            resolve(resp.data);
        }).catch(function (err) {
            console.log(err);
            reject(err);
        });
    })
}

_axios.postUrlEncoded = function (path, data) {
    return new Promise((resolve, reject) => {
        config.headers.ContentType = 'application/x-www-form-urlencoded';
        config.params = null;
        config.data = data;
        axios.post(path, Qs.stringify(data), config).then(function (resp) {
            resolve(resp.data);
        }).catch(function (err) {
            console.log("error is: ");
            console.log(err);
            reject(err);
        })
    })
}


/**
 * 下载文件
 * 需要引入downloadjs
 * @param path
 * @param data
 * @param filename
 * @returns {Promise<any>}
 */
_axios._getDownload = function (path, query, filename) {
    return new Promise((resolve, reject) => {
        config.params = query;
        config.responseType = 'blob';
        axios.get(path, config).then(function (resp) {
            resolve(resp.data);
            console.log("resp", resp);
            filename = filename || extractFileNameFromContentDispositionHeader(resp.headers["content-disposition"]);
            download(resp.data, filename);
        }).catch(function (err) {
            console.log("error is: ");
            console.log(err);
            reject(err);
        })
    })
}


var getClient = _axios.getClient = function (baseUrl) {
    baseUrl = baseUrl || '';
    let axiosClient = {};

    axiosClient.get = function (url, query) {
        let fullUrl = baseUrl + url;
        return window._axios._get(fullUrl, query);
    };

    axiosClient.post = function (url, data) {
        let fullUrl = baseUrl + url;
        return window._axios._post(fullUrl, data);
    };

    axiosClient.getDownload = function (url, query, filename) {
        let fullUrl = baseUrl + url;
        return window._axios._getDownload(fullUrl, query, filename);
    };
    return axiosClient;
}

window._axios = _axios;

export {
    getClient
}