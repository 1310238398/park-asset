import { stringify } from 'qs';
import request from '@/utils/request';
import requestDown from '@/utils/requestDown';

const statisticRouter = 'statistics/project';
const exportStatisticRouter = '/export';

export async function queryPage(params) {
  return request(`/v1/${statisticRouter}?${stringify(params)}`);
}

export async function exportData(params) {
  return requestDown(`/v1/${statisticRouter + exportStatisticRouter}?${stringify(params)}`);
}
