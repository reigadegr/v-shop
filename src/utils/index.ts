export * from './file';
export * from './format';
export * from './goodStorage';
export * from './is';
export * from './lodash';
export * from './mobileConsole';
export * from './validate';
import { getBrowserInfo } from '@/utils/web';

const clientInfo = getBrowserInfo();
/**
 * 打印应用信息
 */
export function consoleAppInfo() {
  console.info('[app] onLaunch');
  console.info('[app] version:', __APP_INFO__.version);
  console.info('[app] URL:', window.location.href);
  console.info(
    '[用户信息] 设备信息：',
    '设备类型',
    getClientInfo().deviceType,
    '是否Android',
    getClientInfo().isAndroid,
    '是否iOS',
    getClientInfo().isIOS,
    '是否微信内打开',
    getClientInfo().isInWeChatApp,
    '是否小程序内打开',
    getClientInfo().isInMiniProgram,
  );
}

/**
 * 客户端信息
 */
export function getClientInfo() {
  return clientInfo;
}

/**
 * rpx2px
 * @param {number} n
 * @param {number} [destWidth] 设计稿基准屏幕宽度
 */
export function rpx2px(n: number, destWidth = 375) {
  const ratio = document.documentElement.clientWidth / destWidth;

  return (n * ratio).toFixed(2);
}
/**
 * 获取接口前缀
 */
export function getAPI(code = 'api') {
  const host: string = import.meta.env.PROD ? import.meta.env.VITE_APP_API_HOST : location.host;
  const origin = `${location.protocol}//${host}`;
  const basePath = import.meta.env.PROD ? `/${import.meta.env.VITE_APP_SUB_DOMAIN}` : '/dev-api';
  const api = `${origin}${basePath}`; // 基础接口
  console.log(api)
  switch (code) {
    case 'host':
      return host;
    case 'origin':
      return origin;
    default:
      return api;
  }
}

/**
 * 动态引入静态资源
 */
export function getAssetsUrl(name: string) {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
}
