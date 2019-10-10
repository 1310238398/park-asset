import moment from 'moment';
import md5 from 'md5';
import uuid from 'uuid/v4';

// 格式化时间戳
export function formatTimestamp(val, format) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment.unix(val).format(f);
}

// 解析时间戳
export function parseTimestamp(val) {
  return moment.unix(val);
}

// 解析日期
export function parseDate(val) {
  return moment(val);
}

// 格式化日期
export function formatDate(val, format) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment(val).format(f);
}

// md5加密
export function md5Hash(value) {
  return md5(value);
}

// 创建UUID
export function newUUID() {
  return uuid();
}

// Form 表单验证手机号
export function checkPhoneNum(_, value, callback) {
  if (value) {
    if (!/^1(3|4|5|7|8)\d{9}$/.test(value)) {
      callback('请输入正确的手机号');
    }
  }
  callback();
}

// 格式化数值
export function formatNumber(v, b, f) {
  const formatDot = (vv, ff) => {
    const s = vv.toString();
    if (s.indexOf('.') > -1) {
      const ss = s.split('.');
      if (ss[1].length > 2) {
        return vv.toFixed(ff);
      }
    }
    return s;
  };

  if (v === 0) {
    return 0;
  }

  if (b > 0) {
    return formatDot(v / b, f);
  }

  return formatDot(v, f);
}

// 全屏
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
