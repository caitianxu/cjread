const Util = {
  //图片地址处理
  transImgUrl: url => {
    if (!url || url.trim().length == 0) {
      return 'http://h5.tuibook.com/assets/img/icon-user.png';
    } else if (url.indexOf('http') !== -1 || url.indexOf('https') !== -1) {
      return url;
    } else {
      return `http://www.tuibook.com${url}`;
    }
  },
  //时间计算
  formatTime(second) {
    let h = 0,
      i = 0,
      s = parseInt(second);
    if (s > 60) {
      i = parseInt(s / 60);
      s = parseInt(s % 60);
    }
    if (i > 60) {
      h = parseInt(i / 60);
      i = parseInt(i % 60);
    }
    // 补零
    let zero = function(v) {
      return v >> 0 < 10 ? '0' + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(':');
  },
};
export default Util;
