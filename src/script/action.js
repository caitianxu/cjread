import store from './store';
import HTTP from './request';
import AsyncStorage from '@react-native-community/async-storage';

//获取缓存
export const _getCookie = key => {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem(key, (err, result) => {
      if (!err && result) {
        resolve(JSON.parse(result));
      } else {
        resolve();
      }
    });
  });
};
//存储缓存
export const _setCookie = (key, value) => {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem(key, JSON.stringify(value));
    resolve();
  });
};
//删除缓存
export const _delCookie = key => {
  return new Promise(function(resolve, reject) {
    AsyncStorage.removeItem(key);
    resolve();
  });
};
//设备信息
export const _clear_store_all = () => {
  return new Promise(function(resolve, reject) {
    AsyncStorage.clear();
    const action = {
      type: 'clear_store_all',
    };
    store.dispatch(action);
    resolve();
  });
};

//设备信息
export const _set_client_info = param => {
  return new Promise(function(resolve, reject) {
    const action = {
      type: 'set_client_info',
      data: {...param},
    };
    store.dispatch(action);
    resolve();
  });
};

//开启 关闭 加载
export const _set_public_loading = bool => {
  return new Promise(function(resolve, reject) {
    const action = {
      type: 'set_public_loading',
      data: bool,
    };
    store.dispatch(action);
    resolve();
  });
};

//用户登录
export const _member_login = (param, callback) => {
  HTTP.post('/v2/api/mobile/login', param).then(res => {
    if (res.code == 0) {
      const {org_id, token, token_type} = res.data;
      let newParam = {...param, org_id, token, token_type};
      _setCookie('memberInfo', newParam);
      const action = {
        type: 'set_member_info',
        data: {...res.data},
      };
      store.dispatch(action);
    } else {
      _delCookie('memberInfo');
    }
    callback && callback();
  });
};

//用户资料变更
export const _change_member_info = (param, data) => {
  return new Promise(function(resolve, reject) {
    const {org_id, token, token_type} = data;
    let newParam = {...param, org_id, token, token_type};
    _setCookie('memberInfo', newParam);
    const action = {
      type: 'set_member_info',
      data: {...data},
    };
    store.dispatch(action);
    resolve();
  });
};

//用户资料变更
export const _update_member_info = (param, data) => {
  return new Promise(function(resolve, reject) {
    const action = {
      type: 'update_member_info',
      data: {...param},
    };
    store.dispatch(action);
    resolve();
  });
};

export const _show_modal = () => {
  const action = {
    type: 'change_modal_visible',
    data: true,
  };
  store.dispatch(action);
};
export const _hide_modal = () => {
  const action = {
    type: 'change_modal_visible',
    data: false,
  };
  store.dispatch(action);
};
