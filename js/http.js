// 封装 http 请求的公共路径

const BASE_URL = 'https://study.duyiedu.com/api';

const fetchFn = async({ url, method = 'GET', params = {} }) => {
    // get 请求参数拼接
    let result = null;
    const extendObj = {};
    sessionStorage.getItem('token') && (extendObj.Authorization = 'Bearer ' + sessionStorage.getItem('token'));
    // console.log(extendObj);
    if (method === 'GET' && Object.keys(params).length) {
        url += '?' + Object.keys(params).map(key => ''.concat(key, '=', params[key])).join('&');
    }
    try {
        const res = await fetch(BASE_URL + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...extendObj
            },
            body: method === 'GET' ? null : JSON.stringify(params)
        });
        // console.log(res);
        const token = res.headers.get('Authorization');
        // console.log(token);
        token && sessionStorage.setItem('token', token);
        result = await res.json();
        return result;
    } catch (error) {
        console.log(error);
    }
}