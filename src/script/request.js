import qs from 'qs';
import store from './store';

const ctxPath = 'http://www.tuibook.com';
const HTTP = {
  get: (url, params) => {
    if (!params) params = {};
    let newUrl = url;
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
      newUrl = `${ctxPath}${url}`;
    }
    newUrl = newUrl + '?' + qs.stringify(params);
    return new Promise((resolve, reject) => {
      fetch(newUrl, {
        method: 'GET',
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject({
            code: 400,
            message: '数据请求异常',
          });
        });
    });
  },
  upload: params => {
    let formData = new FormData();
    let file = {
      uri: params.uri,
      type: 'multipart/form-data',
      name: 'image.png',
    };
    formData.append('file', file);
    return new Promise((resolve, reject) => {
      fetch(`${ctxPath}/file/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject({
            code: 400,
            message: '数据请求异常',
          });
        });
    });
  },
  post: (url, params) => {
    if (!params) params = {};
    const {
      token_type,
      client_type,
      member_token,
      member_id,
      org_id,
    } = store.getState();
    let newParam = {
      token_type,
      client_type,
      member_token,
      member_id,
      org_id,
      ...params,
    };
    let newUrl = url;
    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
      newUrl = `${ctxPath}${url}`;
    }
    return new Promise((resolve, reject) => {
      fetch(newUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: qs.stringify(newParam),
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject({
            code: 400,
            message: '数据请求异常',
          });
        });
    });
  },
};

export default HTTP;
